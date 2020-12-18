const PostArticle = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');

PostArticle.get('/articles', getArticles);
PostArticle.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/https:\/\/\w+.\w+/),
    image: Joi.string().required().pattern(/https:\/\/\w+.\w+/),
  }),
}), createArticle);
PostArticle.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
}), deleteArticle);

module.exports = PostArticle;
