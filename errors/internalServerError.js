const { ErrorDefault } = require('./allErrors');

module.exports.error = (err, req, res, next) => {
  const { statusCode = ErrorDefault, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ErrorDefault
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
