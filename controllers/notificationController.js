const catchAsync = require('./../utils/catchAsync');
const Notification = require('./../models/Notification');
exports.getNotificationController = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const notifications = await Notification.find({
    $and: [{ receiverEmail: email }, { isRed: false }],
  });
  res.status(200).json({
    notifications,
  });
});

exports.updatedNotificationController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedNotification = await Notification.findByIdAndUpdate(id, {
    isRed: true,
  });
  res.status(201).json({
    updatedNotification,
  });
});
