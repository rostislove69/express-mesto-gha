const router = require('express').Router();

const {
  validationGetUserById,
  validationUpdateUserInfo,
  validationUpdateAvatar,
} = require('../middlewares/validator');

const {
  getUsers,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
  getUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.get('/:id', validationGetUserById, getCurrentUser);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);

module.exports = router;
