var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    todosController = require('./controllers/todos_controller.js'),
    usersController = require('./controllers/users_controller.js'),
    app = express();

// static file server directory
app.use(express.static(__dirname + '/client'));

// parse incoming JSON objects
app.use(bodyParser.urlencoded({'extended': 'true'}));

// connect to mongoDB
mongoose.connect('mongodb://localhost/amazeriffic');

var TodoSchema = mongoose.Schema({
  description: String,
  tags: [String]
});

var Todo =  mongoose.model("Todo", TodoSchema);

// listen for requests
http.createServer(app).listen(3000);

app.get('/todos.json', function(req, res) {
  Todo.find({}, function(err, todos) {
    res.json(todos);
  });
});

app.post('/todos', function(req, res) {
  var newTodo = new Todo({"description": req.body.description, tags: req.body.tags });
  newTodo.save(function(err, result) {
    if (err) {
      res.send('ERROR');
    }
    res.json(result);
  });
});


console.log('Server started: http://localhost:3000/');
