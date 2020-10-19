const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
  },
  username: { type: String, required: true },
});

module.exports = mongoose.model('user', UserSchema);
