const { ErrorForbidden } = require('./allErrors');

class ForbiddenError extends Error {
  constructor(message = 'Доступ запрещен') {
    super(message);
    this.statusCode = ErrorForbidden;
  }
}
module.exports = ForbiddenError;
