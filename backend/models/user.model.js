const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  phoneNumber: String,
  avatar: String,
  active: {
    type: Boolean,
    default: false
  },
  notification: {
    type: Boolean,
    default: false
  },
  alterThreshold: {
    type: Number,
    default: 1.5
  },
  mode: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
}, {
  timestamps: true
});

const UsersModel = mongoose.model("User", UserSchema);

module.exports = {
  UsersModel,
};

