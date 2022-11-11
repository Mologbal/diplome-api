const { Error } = require('mongoose');
const { ErrorValidation } = require('./allErrors');

class BadRequestError extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = ErrorValidation;
  }
}
module.exports = BadRequestError;
