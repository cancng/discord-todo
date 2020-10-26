const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: { type: String, required: true },
    isCompleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', TodoSchema);
