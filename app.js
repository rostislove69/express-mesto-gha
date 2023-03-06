const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join((__dirname, 'public'))));
app.use((req, res, next) => {
  req.user = {
    _id: '64045e0d7efdc2c9e412a5a2',
  };
  next();
});
app.use(routes);

app.listen(PORT);
