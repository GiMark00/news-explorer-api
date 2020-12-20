const PostArticle = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');
const { NotFoundError } = require('../middlewares/error');
const auth = require('../middlewares/auth');

PostArticle.use(auth);

PostArticle.get('/articles', getArticles);
PostArticle.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильно заполнено поле \'link\'.');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильно заполнено поле \'image\'.');
    }),
  }),
}), createArticle);
PostArticle.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
}), deleteArticle);

PostArticle.use('/', () => {
  throw new NotFoundError('Запрос не найден.');
});

module.exports = PostArticle;
