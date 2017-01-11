// server.js

// require express framework and additional modules
var express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session');

// create express app object
var app = express();

// middleware

app.use(bodyParser.urlencoded({extended: true}));
// add this so that we can accept request payloads
app.use(bodyParser.json());

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes in microseconds
}));

// bring in controllers
var controllers = require('./controllers');

// API routes
// get all users
app.get('/api/users', controllers.auth.index);

// "sign up" - create a user
app.post('/api/users', controllers.auth.create);

// get current user information
app.get('/api/users/current', controllers.auth.getCurrentUser);

// get one user's information by id
app.get('/api/users/:id', controllers.auth.show);

// "log in" - authenticate the user and set the session
app.post('/api/sessions', controllers.auth.login);

// logout - clear the session
app.get('/api/logout', controllers.auth.logout);

// listen on port 3000
app.listen(3000, function () {
  console.log('server started on locahost:3000');
});
