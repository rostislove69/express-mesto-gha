const router = require('express').Router();
const { statusCodes, message } = require('../utils/constants');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res, next) => {
  res.status(statusCodes.notFound).send(message.pageNotFound);
  next();
});

module.exports = router;
