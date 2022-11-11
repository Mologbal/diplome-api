const { ErrorNotFound } = require('./allErrors');

class NotFoundError extends Error {
  constructor(message = 'Запрашиваемый ресурс не обнаружен') {
    super(message);
    this.statusCode = ErrorNotFound;
  }
}
module.exports = NotFoundError;
