const User = require('../models/user');
const { statusCodes, message } = require('../utils/constants');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(statusCodes.ok).send(users))
  .catch(() => res.status(statusCodes.serverError).send(message.serverError));

const getCurrentUser = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      res.status(statusCodes.notFound).send(message.userNotFound);
      return;
    }
    res.status(statusCodes.ok).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(statusCodes.badRequest).send(message.badRequest);
      return;
    }
    res.status(statusCodes.serverError).send(message.serverError);
  });

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(statusCodes.created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(statusCodes.ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(statusCodes.ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  postUser,
  updateUserInfo,
  updateUserAvatar,
};
