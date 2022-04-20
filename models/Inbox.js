const mongoose = require('mongoose');

const inboxSchema = mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  diary: {
    type: Object,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  isRed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Inbox = mongoose.model('inboxes', inboxSchema);

module.exports = Inbox;
