const Card = require('../models/card');
const { statusCodes, message } = require('../utils/constants');

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(statusCodes.ok).send(cards))
  .catch(() => res.status(statusCodes.serverError).send(message.serverError));

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(statusCodes.created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(statusCodes.notFound).send(message.cardNotFound);
      return;
    }
    res.status(statusCodes.ok).send(message.deleted);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(statusCodes.badRequest).send(message.badRequest);
      return;
    }
    res.status(statusCodes.serverError).send(message.serverError);
  });

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send(message.cardNotFound);
        return;
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send(message.cardNotFound);
        return;
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send(message.badRequest);
        return;
      }
      res.status(statusCodes.serverError).send(message.serverError);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  deleteLike,
};
