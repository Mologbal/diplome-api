const { ErrorConflict } = require('./allErrors');

class ConflictError extends Error {
  constructor(message = 'Этот Email уже существует') {
    super(message);
    this.statusCode = ErrorConflict;
  }
}
module.exports = ConflictError;
