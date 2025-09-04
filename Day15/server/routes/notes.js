const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { authMiddleware } = require('./auth');

// All note routes now require auth
router.get('/', authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

router.post('/', authMiddleware, async (req, res) => {
  const note = new Note({ ...req.body, userId: req.user.id });
  const saved = await note.save();
  res.status(201).json(saved);
});

module.exports = router;
