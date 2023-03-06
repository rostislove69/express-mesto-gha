const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  postUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getCurrentUser);
router.post('/', postUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
