const statusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
  serverError: 500,
};

const messages = {
  deleted: 'Пост успешно удален',
  badRequest: 'Переданы некорректные данные',
  cardNotFound: 'Пост не найден',
  userNotFound: 'Такого пользователя не существует',
  pageNotFound: 'Такой страницы не существует',
  serverError: 'На сервере произошла ошибка',
};

module.exports = {
  statusCodes,
  messages,
};
