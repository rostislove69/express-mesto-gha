const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const NotAuthError = require('../errors/NotAuthError');
const { statusCodes, messages } = require('../utils/constants');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(statusCodes.ok).send(users))
  .catch(next);

const getCurrentUser = (req, res, next) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError(messages.userNotFound);
    }
    res.status(statusCodes.ok).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(messages.badRequest));
    }
    next(err);
  });

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(statusCodes.created).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      } if (err.code === 11000) {
        next(new ConflictError(messages.userAlredyCreated));
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(statusCodes.ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(statusCodes.ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthError(messages.loginFailed);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthError(messages.loginFailed);
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch(next);
};

const getUserProfile = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError(messages.userNotFound);
    }
    res.status(statusCodes.ok).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(messages.badRequest));
    }
    next(err);
  });

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getUserProfile,
};
