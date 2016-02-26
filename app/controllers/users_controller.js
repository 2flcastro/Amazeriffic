var mongoose = require('mongoose'),
    User = require('../models/user.js');


// User.find({}, function (err, result) { if (err !== null) {
//             console.log("SOMETHING WENT HORRIBLY WRONG");
// console.log(err);
// } else if (result.length === 0) {
// console.log("Creating Example User...");
// var exampleUser = new User({"username":"semmy"}); exampleUser.save(function (err, result) {
// if (err) { console.log(err);
// }else{
// console.log("Saved Example User");
// } });
// } });

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
  User.find({'username': req.params.username}, function(err, users) {
    if (err) {
      console.log(err);
    } else if (users.length !== 0) {
      // we found a user
      res.sendfile('./client/index.html')
    } else {
      res.send(404);
    }
  });
  res.sendfile('./client/index.html');
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
    }
  });
};

module.exports = UsersController;
