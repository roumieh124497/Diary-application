const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');
exports.getUserInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  res.status(200).json({
    user,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    users,
  });
});
