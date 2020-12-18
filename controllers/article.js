const Article = require('../models/article');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../middlewares/error');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (!articles.length) {
        throw new NotFoundError('В базе нет статей.');
      }
      res.send({ data: articles });
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const currentUserId = req.user._id;
  Article.findById(req.params.articleId)
    .orFail(new Error('notValidId'))
    .then((article) => {
      const owner = article.owner._id.toString();
      if (!article._id) {
        throw new NotFoundError('Статьи нет в базе.');
      } else if (currentUserId !== owner) {
        throw new ForbiddenError('Нельзя удалить чужую статью.');
      } else {
        Article.deleteOne(article)
          .then(() => {
            res.send({ data: article });
          });
      }
    })
    .catch(next);
};
