var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/simple-login');

module.exports = {
  User: require('./user.js')
};
