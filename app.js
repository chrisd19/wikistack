'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var wikiRoutes = require('./routes/wiki.js');
var usersRoutes = require('./routes/users');
var models = require('./models');


app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/wiki', wikiRoutes);

app.use('/users', usersRoutes);

models.User.sync()
  .then(function() {
    return models.Page.sync()
  })
  .then(function() {
    app.listen(3001, function() {
      console.log('Server is listening on port 3001!');
    })
  })
  .catch(console.error);

// app.listen(1337);
