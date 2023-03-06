const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res, next) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
  next();
});

module.exports = router;
