// server.js

// require express framework and additional modules
var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session');

// create express app object
var app = express();

// connect to database and pull in model(s)
mongoose.connect('mongodb://localhost/simple-login');
var User = require('./models/user');

// middleware
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
// add this so that we can accept request payloads
app.use(bodyParser.json());

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes in microseconds
}));

// HTML routes
app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/templates/:name', function templates(req, res) {
  var name = req.params.name;
  res.sendFile(__dirname + '/views/templates/' + name + '.html');
});

// API routes

// get all users
app.get('/api/users', function (req, res) {
  User.find({}, function(err, allUsers){
    if(allUsers){
      res.json(allUsers);
    } else {
      res.status(500).send('server error');
    }
  });
});

// "sign up"
// create a user
app.post('/users', function (req, res) {
  console.log(req.body);
  User.createSecure(req.body.email, req.body.password, function (err, newUser) {
    if (newUser){
      req.session.userId = newUser._id; // log the user in immediately
      res.json(newUser);
    } else {
      console.log('user creation error:', err);
      res.status(500).send(err);
    }
  });
});

// "log in"
// authenticate the user and set the session
app.post('/sessions', function (req, res) {
  // call authenticate function to check if password user entered is correct
  User.authenticate(req.body.email, req.body.password, function (err, loggedInUser) {
    if (err){
      console.log('authentication error: ', err);
      res.status(500).send(err);
    } else {
      console.log('setting sesstion user id ', loggedInUser._id);
      req.session.userId = loggedInUser._id;
      res.json(loggedInUser);
    }
  });
});

// get current user information
app.get('/current-user', function (req, res) {
  console.log('session user id: ', req.session.userId);
  // find the user currently logged in
  User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err){
      console.log('database error: ', err);
      res.status(500).send(err);
    } else {
      console.log('found current user');
      res.json(currentUser);
    }
  });
});

// get one user's information
app.get('/users/:id', function (req, res) {
  User.findOne({_id: req.params.id}, function (err, foundUser) {
    if (err){
      console.log('database error: ', err);
      res.status(500).send(err);
    } else {
      console.log('found user');
      res.json(foundUser);
    }
  });
});

app.get('/logout', function (req, res) {
  // remove the session user id
  req.session.userId = null;
  // redirect to login (for now)
  // res.redirect('/login');
  res.status(200).send('login successful');
});

// listen on port 3000
app.listen(3000, function () {
  console.log('server started on locahost:3000');
});
