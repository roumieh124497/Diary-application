const catchAsync = require('./../utils/catchAsync');
const Inbox = require('./../models/Inbox');
exports.getDiayController = catchAsync(async (req, res, next) => {
  const inboxes = await Inbox.find({
    email: req.body.email,
  });

  res.status(200).json({
    inboxes,
  });
});

exports.updateInbox = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const updatedInbox = await Inbox.findByIdAndUpdate(id, {
    isRed: true,
  });
  console.log(updatedInbox);
  res.status(201).json({
    updatedInbox,
  });
});

exports.getOneInboxController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const inbox = await Inbox.findOne({
    _id: id,
  });
  res.status(200).json({
    inbox,
  });
});
