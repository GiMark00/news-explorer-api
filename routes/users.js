const PostUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

PostUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

PostUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

PostUsers.use(auth);

PostUsers.get('/users/me', getUser);

module.exports = PostUsers;
