const express = require('express');
const app = express();

// var router = require('./routes.js');

// app.use('/', router);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;