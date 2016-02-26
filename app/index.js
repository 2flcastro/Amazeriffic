var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    TodosController = require('./controllers/todos_controller.js'),
    UsersController = require('./controllers/users_controller.js'),
    app = express();

// static file server directory
app.use(express.static(__dirname + '/client'));

// parse incoming JSON objects
app.use(bodyParser.urlencoded({'extended': 'true'}));

// connect to mongoDB
mongoose.connect('mongodb://localhost/amazeriffic');

// listen for requests
http.createServer(app).listen(3000);

// TodosController
app.get('/todos.json', TodosController.index);
app.post('/todos', TodosController.create);
app.get('/todos/:id', TodosController.show);
app.put('/todos/:id', TodosController.update);
app.delete('/todos', TodosController.destroy);

// UsersController
app.get('/users', UsersController.index);
app.get('/users/:username', UsersController.show);
app.post('/users/', UsersController.create);

// Users/Todos
app.get('/users/:username/todos.json', TodosController.index);
app.get('/users/:username/todos/:id', TodosController.show)
app.post('/users/:username/todos', TodosController.create);
app.put('/users/:username/todos/:id', TodosController.update);
app.delete('/users/:username/todos', TodosController.destroy);

console.log('Server started: http://localhost:3000/');
