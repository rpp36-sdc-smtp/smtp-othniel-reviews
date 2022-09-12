require('newrelic');
const express = require('express');
const app = express();

var router = require('./routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;