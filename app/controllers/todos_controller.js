var mongoose = require('mongoose'),
    Todo = require('../models/todo.js'),
    User = require('../models/user.js');

var TodosController = {};

TodosController.index = function(req, res) {
  // check for username, if none return all todos
  var username = req.params.username || null;

  var respondWithTodos = function(query) {
    Todo.find(query, function(err, todos) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(200, todos);
      }
    });
  };

  if (username) {
    // get todos associated with username
    User.find({"username": username}, function(err, user) {
      if (err) {
        res.json(500, err);
      } else if (user.length === 0) {
        // no user with that id
        res.send(404);
      } else {
        // respond with user's todos objects
        respondWithTodos({"owner": user[0].id})
      }
    });
  } else {
    respondWithTodos({});
  }
};

TodosController.create = function(req, res) {
  // add a user to new todo if there is one
  var username = req.params.username || null;

  var newTodo = new Todo({"description": req.body.description,
                          "tags": req.body.tags,
                          "complete": false });

  User.find({"username": username}, function(err, usernames) {
    if (err) {
      res.send(500);
    } else {
      if (usernames.length === 0) {
        // create userless todo
        newTodo.owner = null;
      } else {
        // attach the user
        newTodo.owner = usernames[0]._id;
      }
      newTodo.save(function(err, result) {
        if (err) {
          res.json(500, err);
        } else {
          res.json(200, result);
        }
      });
    }
  });
};

TodosController.show = function(req, res) {
  var id = req.params.id;
  console.log('showing todo ' + id);
  Todo.find({"_id": id}, function(err, todo) {
    if (err) {
      res.json(500, err);
    } else {
      if (todo.length > 0) {
        res.json(200, todo[0]);
      } else {
        res.send(404);
      }
    }
  });
};

TodosController.update = function(req, res) {
  var id = req.params.id;
  console.log('updating todo ' + id);
  Todo.find({"_id": id}, function(err, todos) {
    if (err) {
      res.json(500, err);
    } else {
      if (todos.length > 0) {
        console.log(todos[0].complete);
        todos[0].complete = !todos[0].complete;
        console.log(todos[0].complete);
        todos[0].save();
      } else {
        res.send(404);
      }
    }
  });
};

TodosController.destroy = function(req, res) {
  console.log('deleteing completed todo');
  Todo.find({"complete": true}, function(err, todos) {
    if (err) {
      res.json(500, err);
    } else {
      todos.forEach(function(todo) {
        todo.remove();
      });
    }
  });
};

module.exports = TodosController;
