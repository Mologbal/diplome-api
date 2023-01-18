const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError());
          } else if (err.code === 11000) {
            next(new ConflictError());
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError());
        return;
      }

      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret-code',
        { expiresIn: '7d' },
      );

      res
        .cookie('access_token', token, {
          sameSite: 'none',
          secure: true,
        })
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
    })
    .catch(next);
};

const signOut = (req, res) => {
  res.clearCookie('access_token').send({ message: 'logout' });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError());
      }

      return res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError());
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError());
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError());
        return;
      }
      next(err);
    });
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateUser,
};
