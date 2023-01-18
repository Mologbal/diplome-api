const regular = /^(https?:\/\/)(www\.)?([a-z1-9-]{1,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i;

const ALLOWED_CORS = [
  'http://localhost:3000',
];

const mongoServer = 'mongodb://127.0.0.1:27017/moviesdb';

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  ALLOWED_CORS, DEFAULT_ALLOWED_METHODS, regular, mongoServer,
};
