const express = require('express');
const app = express();
if(process.env.NODE_ENV === 'production') {
  require('newrelic');
  var fs = require('fs');
  var morgan = require('morgan');
  var path = require('path');
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400; } }));
}


var router = require('./routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;