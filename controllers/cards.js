const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NoRightsError = require('../errors/NoRightsError');
const NotFoundError = require('../errors/NotFoundError');
const { statusCodes, messages } = require('../utils/constants');

const getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(statusCodes.ok).send(cards))
  .catch(next);

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(statusCodes.created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError(messages.cardNotFound);
    }
    if (!card.owner.equals(req.user._id)) {
      throw new NoRightsError(messages.notDeleted);
    }
    card.deleteOne()
      .then(() => res.status(statusCodes.ok).send({ message: messages.deleted }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(messages.badRequest));
    } else {
      next(err);
    }
  });

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(messages.cardNotFound);
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(messages.badRequest));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(messages.cardNotFound);
      }
      res.status(statusCodes.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(messages.badRequest));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  deleteLike,
};
