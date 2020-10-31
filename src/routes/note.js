const router = require('express').Router();
const Note = require('../models/note');
const asyncHandler = require('express-async-handler');
const isAuthorized = require('../middleware/authMiddleware');

router.get(
  '/',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  })
);

router.get(
  '/:id',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404);
      throw new Error('Note not found');
    }
  })
);

router.post(
  '/create',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { title, text } = req.body;
    if (title.length <= 2 || title.length >= 50) {
      res.status(400);
      throw new Error('Note title must be between 2 and 50 characters.');
    }
    const note = new Note({
      user: req.user._id,
      title: title.trim(),
      text,
    });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  })
);

router.delete(
  '/:id',
  isAuthorized,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (note) {
      await note.remove();
      res.json('Note deleted');
    } else {
      res.status(404);
      throw new Error('Note not found');
    }
  })
);

module.exports = router;
