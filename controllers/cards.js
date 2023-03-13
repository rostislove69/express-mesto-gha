const Card = require('../models/card');
const { statusCodes, messages } = require('../utils/constants');

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(statusCodes.ok).send(cards))
  .catch(() => res.status(statusCodes.serverError).send({ message: messages.serverError }));

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(statusCodes.created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCodes.badRequest).send({ message: messages.badRequest });
        return;
      }
      res.status(statusCodes.serverError).send({ message: messages.serverError });
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(statusCodes.notFound).send({ message: messages.cardNotFound });
      return;
    }
    res.status(statusCodes.ok).send({ message: messages.deleted });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(statusCodes.badRequest).send({ message: messages.badRequest });
      return;
    }
    res.status(statusCodes.serverError).send({ message: messages.serverError });
  });

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCodes.notFound).send({ message: messages.cardNotFound });
        return;
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: messages.badRequest });
        return;
      }
      res.status(statusCodes.serverError).send({ message: messages.serverError });
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
        res.status(statusCodes.notFound).send({ message: messages.cardNotFound });
        return;
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCodes.badRequest).send({ message: messages.badRequest });
        return;
      }
      res.status(statusCodes.serverError).send({ message: messages.serverError });
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  deleteLike,
};
