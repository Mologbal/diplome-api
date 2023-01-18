const express = require('express');
const { registerValidation, loginValidation } = require('../validation/auth');

const app = express();

const { signUp, signIn, signOut } = require('../controllers/users');

app.post('/signin', loginValidation, signIn);
app.post('/signup', registerValidation, signUp);
app.get('/signout', signOut);

module.exports = app;
