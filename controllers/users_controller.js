var mongoose = require('mongoose'),
    User = require('../models/user.js');

var UsersController = {};

UsersController.index = function(req, res) {
  console.log('index action called');
  User.find({}, function(err, users) {
    if (err) {
      res.json(err);
    } else {
      res.json(users);
    }
  });
};

UsersController.show = function(req, res) {
  console.log('UsersController show action called');
  User.find({'_id': req.params.id}, function(err, users) {
    if (err) {
      console.log(err);
    } else if (users.length !== 0) {
      // we found a user
      res.sendfile('./client/todos.html');
    } else {
      res.send(404);
    }
  });
};

UsersController.create = function(req, res) {
  console.log('create user action called');
  var username = req.body.username;
  console.log('creating a new user: ' + username);
  var newUser = new User({"username": username });
  newUser.save(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved new user: ' + result);
      res.json(result);
    }
  });
};

UsersController.username = function(req, res) {
  console.log('get the username controller called');
  User.find({"_id": req.params.id}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.send(users[0].username);
    }
  });
};

module.exports = UsersController;
