const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { errors } = require('celebrate');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { validationCreateUser, validationLogin } = require('./middlewares/validator');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join((__dirname, 'public'))));
app.use(cors());

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(auth);

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
