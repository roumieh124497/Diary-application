const mongoose = require('mongoose');

const diarySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please write a title for your diary 😄!'],
  },
  date: {
    type: String,
    required: [true, 'Please choose a date 😄!'],
  },
  diary: {
    type: String,
    required: [true, 'Please write a diary 😄!'],
  },
  feeling: {
    type: String,
    required: [true, 'Please put your feeling 😄!'],
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Diary = mongoose.model('diaries', diarySchema);

module.exports = Diary;
