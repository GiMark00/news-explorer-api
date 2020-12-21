const AllRoutes = require('express').Router();
const PostUsers = require('./users');
const PostArticle = require('./article');

AllRoutes.use('/', PostUsers);
AllRoutes.use('/', PostArticle);

module.exports = AllRoutes;
