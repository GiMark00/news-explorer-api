const AllRoutes = require('express').Router();
const PostUsers = require('./users');
const PostArticle = require('./article');
const { NotFoundError } = require('../middlewares/errors/NotFoundError');

AllRoutes.use('/', PostUsers);
AllRoutes.use('/', PostArticle);
AllRoutes.use('/', () => {
  throw new NotFoundError('Запрос не найден.');
});

module.exports = AllRoutes;
