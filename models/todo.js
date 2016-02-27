var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var TodoSchema = mongoose.Schema({
  description: String,
  tags: [String],
  complete: Boolean,
  owner: {type: ObjectId, ref: 'User'}
});

var Todo =  mongoose.model('Todo', TodoSchema);

module.exports = Todo;
