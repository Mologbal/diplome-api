const { ErrorUnauthorized } = require('./allErrors');

class UnauthorizedError extends Error {
  constructor(message = 'Сперва авторизируйтесь') {
    super(message);
    this.statusCode = ErrorUnauthorized;
  }
}
module.exports = UnauthorizedError;
