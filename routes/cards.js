const router = require('express').Router();
const { validationPostCard, validationCardId } = require('../middlewares/validator');
const {
  getCards,
  postCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validationPostCard, postCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.put('/:cardId/likes', validationCardId, addLike);
router.delete('/:cardId/likes', validationCardId, deleteLike);

module.exports = router;
