require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const AllRoutes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const whitelist = [
  'http://localhost:8080',
  'https://api.goosenews.students.nomoreparties.space',
];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowHeaders: 'Content-Type',
  optionsSuccessStatus: 200,
};

const { PORT = 3000, DATA_URL, NODE_ENV } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATA_URL : 'mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', AllRoutes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
