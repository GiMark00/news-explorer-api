const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../middlewares/errors/NotFoundError');
const { ConflictError } = require('../middlewares/errors/ConflictError');
const { UnauthorizedError } = require('../middlewares/errors/UnauthorizedError');
const { BadRequestError } = require('../middlewares/errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      data: {
        id: user.id, email: user.email, name: user.name,
      },
    }))
    .catch((err) => {
      if (err.message.includes('unique')) {
        throw new ConflictError('Введённая почта уже зарегистрирована.');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильно введена почта.');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильно введён пароль.');
        }
        const token = jwt.sign({
          _id: user._id,
        }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: 3600 * 24 * 7 });
        return res.status(201).send({ message: `Токен: ${token}` });
      });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(new Error('NotFound'))
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные.');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователя нет в базе.');
      }
      next(err);
    })
    .catch(next);
};
