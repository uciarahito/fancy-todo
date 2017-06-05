const Todo = require('../models/todo')
let Helpers = require('../helpers/helpers')
let methods = {}
const serverSMS = require('../helpers/serverSMS')

methods.createTodo = (req, res) => {
  let dueDate
  if (req.body.dueDate) {
    dueDate = new Date(req.body.dueDate)
  } else {
    dueDate = null
  }
  let newTodo = new Todo({
    title: req.body.title,
    content: req.body.content,
    user: req.body.user,
    dueDate: dueDate,
    completedDate: null,
    isCompleted: false
  })

  newTodo.save((err, record) => {
    if (err) res.json({err})
    console.log('Create todo success');
    console.log(record);

    Todo.findById(record._id)
    .populate('user')
    .exec((err, record) => {
        console.log('get detail todo success');
        console.log(record);
        serverSMS.sendSMS(record)
    })

    res.send(record)
  })
}

methods.getAllTodo = (req, res) => {
  Todo.find({})
  .populate('user')
  .exec((err, records) => {
    console.log('get all todos success');
    console.log(records);
    res.send(records)
  })
}

methods.getAllTodoByUser = (req, res) => {
  let id = req.headers.id
  Todo.find({})
  .populate('user')
  .exec((err, todos) => {
    console.log('get all todo local success');
    console.log(todos);
    let pushData = []
    todos.forEach(todo => {
      console.log(todo.user._id);
      if (todo.user._id == id) {
        pushData.push(todo)
      }
    })
    res.send(pushData)
  })
}

methods.getDetailTodo = (req, res) => {
  let id = req.headers.id
  Todo.findById(req.params.id)
  .populate('user')
  .exec((err, record) => {
    if (record.user._id == id) {
      console.log('get detail todo success');
      console.log(record);
      res.send(record)
    } else {
      res.send('You are not authorized')
    }
  })
}

methods.editTodo = (req, res) => {
  console.log('mmmmmmmm');
  let id = req.headers.id
  Todo.findById(req.params.id)
  .populate('user')
  .exec((err, record) => {
    console.log('get detail todo success');
    console.log(record);
    // console.log(record.user+' *** '+decoded.id);

    if (req.body.dueDate) {
      dueDate = new Date(req.body.dueDate)
    } else {
      dueDate = null
    }
    if (req.body.completedDate) {
      completedDate = new Date(req.body.completedDate)
    } else {
      completedDate = null
    }

    if (record.user._id == id) {
      Todo.updateOne({
        "_id": record._id
      }, {
        $set: {
          "title": req.body.title || record.title,
          "content": req.body.content || record.content,
          "user": req.body.user || record.user,
          "updatedDate": new Date() || record.updatedDate,
          "dueDate": dueDate,
          "completedDate": completedDate,
          "isCompleted": req.body.isCompleted || record.isCompleted
        }
      })
      .exec((err, result) => {
        console.log('Success');
        res.send(record)
      })
    } else {
      res.send('You are not authorized')
    }
  })
}

methods.deleteTodo = (req, res) => {
  let id = req.headers.id
  Todo.findById(req.params.id)
  .populate('user')
  .exec((err, record) => {
    console.log('get detail todo success');
    console.log(record);
    if (record.user._id == id) {
      Todo.deleteOne({
        "_id": record._id
      })
      .exec((err, result) => {
        res.send(record)
      })
    } else {
      res.send('You are not authorized')
    }
  })
}

module.exports = methods