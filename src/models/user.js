const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    avatarURL: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
