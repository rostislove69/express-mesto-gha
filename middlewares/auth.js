const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const { messages } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(messages.needAuth);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new NotAuthError(messages.needAuth));
  }
  req.user = payload;
  next();
};
