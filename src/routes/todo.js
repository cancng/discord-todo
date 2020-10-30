const router = require('express').Router();
const Todo = require('../models/todo');
const asyncHandler = require('express-async-handler');
const isAuthorized = require('../middleware/authMiddleware');

router.post(
  '/create',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { todoText } = req.body;
    if (todoText.length > 400) {
      res.status(400);
      throw new Error("Todo text can't be longer than 400 words.");
    }
    const todo = new Todo({
      user: req.user._id,
      text: todoText.trim(),
      isCompleted: false,
    });
    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  })
);

router.get(
  '/',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const todoPerPage = 3;
    const page = Number(req.query.page) || 1;
    const unlimitedTodos = await Todo.find({ user: req.user._id });
    const todos = await Todo.find({ user: req.user._id })
      .limit(todoPerPage)
      .skip(todoPerPage * (page - 1))
      .sort({
        createdAt: -1,
      });
    res.json({
      todos,
      page,
      pages: Math.ceil(unlimitedTodos.length / todoPerPage),
    });
  })
);

router.delete(
  '/:id',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (todo) {
      await todo.remove();
      res.json('Todo deleted');
    } else {
      res.status(404);
      throw new Error('Todo not found');
    }
  })
);

router.post(
  '/mark/:id',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      await todo.save();
      res.json('OK');
    } else {
      res.status(404);
      throw new Error('Todo not found');
    }
  })
);

module.exports = router;
