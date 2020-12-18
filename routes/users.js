const PostUsers = require('express').Router();
const { getUser } = require('../controllers/users');

PostUsers.get('/users/me', getUser);

module.exports = PostUsers;
