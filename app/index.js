var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    todosController = require('./controllers/todos_controller.js'),
    usersController = require('./controllers/users_controller.js'),
    app = express();

var todos = [
  {"id": 1, "description": "Throw out the trash", "tags": ["chores"], "complete": false},
  {"id": 2, "description": "Finish reading books", "tags": ["reading", "fun"], "complete": false},
  {"id": 3, "description": "Listen to entire music library", "tags": ["music", "fun"], "complete": false}
];


// static file server directory
app.use(express.static(__dirname + '/client'));

// parse incoming JSON objects
app.use(bodyParser.urlencoded({'extended': 'true'}));

// listen for requests
http.createServer(app).listen(3000);

app.get('/todos.json', function(req, res) {
  res.json(todos);
});

app.post('/todos', function(req, res) {
  var newTodo = req.body;
  newTodo.id = todos.length + 1;
  console.log(newTodo);
  todos.push(newTodo);
  console.log(todos);
  // send back a simple object
  res.json({"message": "You posted to the server!"});
});


console.log('Server started: http://localhost:3000/');
