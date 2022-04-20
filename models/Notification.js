const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
  receiverEmail: {
    type: String,
    required: true,
  },
  isRed: {
    type: Boolean,
    default: false,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Notification = mongoose.model('notifications', NotificationSchema);

module.exports = Notification;
