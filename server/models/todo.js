const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  content: String,
  createdDate: {
    type: Date,
    default: Date.now()
  },
  updatedDate: {
    type: Date,
    default: Date.now()
  },
  dueDate: Date,
  completedDate: Date,
  isCompleted: Boolean
});

let Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo