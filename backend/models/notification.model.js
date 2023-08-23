const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: String,
  marked: {
    type: Boolean,
    default: false
  },
  watchingItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WatchingProduct'
  },
  alreadyRead: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);

module.exports = {
  NotificationModel
}