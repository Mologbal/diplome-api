const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { getJwtToken } = require('../utils/jwt');

// выдаст информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(new NotFound())
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

// создаст нового пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = { ...user._doc };
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError());
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

// функция входа
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user._id);
      return res.send({ token });
    })
    .catch(next);
};

// обновит информацию о пользователе
const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
      }
      if (err.code === 11000) {
        return next(new ConflictError());
      }
      return next(err);
    });
};

module.exports = {
  createUser, updateUserInfo, getUserInfo, login,
};
