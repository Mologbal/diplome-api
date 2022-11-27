const jwt = require('jsonwebtoken');

const getJwtToken = (id) => jwt.sign({ _id: id }, process.env.NODE_ENV === 'production' ? process.env.YOUR_JWT : 'secret-code', { expiresIn: '7d' }); // настройка сохранения токена сроком на неделю

module.exports = { getJwtToken };
