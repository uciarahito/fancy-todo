const express = require('express')
const router = express.Router()
let userController = require('../controllers/userController')
let todoController = require('../controllers/todoController')
let helpers = require('../helpers/helpers')

// NOTE: user
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.post('/signinfb', userController.signInFB)
router.get('/allusers', userController.getAllUsers)
router.get('/detailuser/:id', userController.getUserById)
router.put('/edituser/:id', userController.editUser)  // password harus disertakan
router.delete('/deleteuser/:id', userController.deleteUserById)

// NOTE: todo
router.post('/createtodo', todoController.createTodo)
router.get('/alltodo', todoController.getAllTodo)
router.get('/alltodobyuser', todoController.getAllTodoByUser)
router.get('/detailtodo/:id', todoController.getDetailTodo)
router.put('/edittodo/:id', todoController.editTodo)
router.delete('/deletetodo/:id', todoController.deleteTodo)

module.exports = router