const express = require('express');
const app = express();
const port = 3000;

// var router = require('./routes.js');

// app.use('/', router);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log('listening on port ', port);
});

module.exports = app;