require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');
const ratelimiter = require('./utils/rateLimiter');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const NotFound = require('./errors/notFoundError');
const { error } = require('./errors/internalServerError');
const loginAndRegister = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLoger } = require('./middlewares/logger');
const { mongoServer } = require('./utils/constants');

const { PORT = 3002, DB_HOST, NODE_ENV } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_HOST : mongoServer, {
  useNewUrlParser: true,
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт!');
  }, 0);
});

app.use(cors);

// Логгер запросов до маршрутов
app.use(requestLogger);

app.use(ratelimiter);

app.use(helmet());

app.use(cookieParser());

// Регистрация и авторизация
app.use('/', loginAndRegister);
// Защита роутов от неавторизованных пользователей
app.use(auth);

// Защищенные роуты
app.use(userRouter);
app.use('/', movieRouter);
app.use('*', (req, res, next) => {
  next(new NotFound());
});

// Логгер ошибок и далее их обработка
app.use(errorLoger);

app.use(errors());

app.use(error);

app.listen(PORT);
