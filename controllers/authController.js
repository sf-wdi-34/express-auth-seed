var db = require('../models');
var User = db.User;

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  getCurrentUser: getCurrentUser,
  login: login,
  logout: logout
};

// helper
function sendServerError(responseObject){
  responseObject.status(500).send('server error');
}

// API route handlers

// get all users
function index(req, res) {
  User.find({}, function(err, allUsers){
    if(allUsers){
      res.json(allUsers);
    } else {
      sendServerError(res);
    }
  });
}

// "sign up"
// create a user
function create(req, res) {
  console.log(req.body);
  User.createSecure(req.body.email, req.body.password, function (err, newUser) {
    if (err){
      console.log('user creation error:', err);
      sendServerError(res);
    } else {
      console.log('user created with email:', newUser.email);
      req.session.userId = newUser._id; // log the user in immediately
      res.json(newUser);
    }
  });
}

// get one user's information
function show(req, res) {
  User.findOne({_id: req.params.id}, function (err, foundUser) {
    if (err){
      console.log('database error: ', err);
      res.status(500).send('server error');
    } else {
      console.log('found user');
      res.json(foundUser);
    }
  });
}

// get current user information
function getCurrentUser(req, res) {
  console.log('session user id: ', req.session.userId);
  // find the user currently logged in
  User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err){
      console.log('database error: ', err);
      sendServerError(res);
    } else {
      console.log('found current user');
      res.json(currentUser);
    }
  });
}

// "log in"
// authenticate the user and set the session
function login(req, res) {
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
}

// logout (clears the session)
function logout(req, res) {
  // remove the session user id
  req.session.userId = null;
  res.status(200).send('logout successful');
};
