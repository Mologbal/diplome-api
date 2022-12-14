const Movie = require('../models/movie');
const NotFound = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

// выдаст список фильмов, созданных текущим пользователем
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
        return;
      }
      next(err);
    });
};

// создаст новый фильм
const createMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
        return;
      }
      next(err);
    });
};

// удалит фильм по переданному _id
const deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const { objectId } = req.params;
  Movie.findById(objectId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFound();
      }
      if (movie.owner.toString() !== ownerId) {
        throw new ForbiddenError();
      }
      return movie;
    })
    .then((movie) => {
      Movie.deleteOne(movie)
        .then(() => {
          res.status(200).send({ message: 'Фильм успешно удалён!' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
