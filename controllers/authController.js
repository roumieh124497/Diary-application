const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const bcrypt = require('bcrypt');
const validator = require('validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../', 'client', 'build'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      'profile' +
        new Date().toISOString().replace(/:/g, '-') +
        file.originalname,
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/tiff'
  ) {
    //correct format
    return cb(null, true);
  } else {
    //wrong format
    return cb(
      new AppError('The file, you uploaded is not an image 😥!', 400),
      false,
    );
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;
  const user = await User.findOne({ email: email });
  if (user) return next(new AppError('User already exists!', 400));

  if (!(password === confirmPassword))
    return next(new AppError('Passwords do not match!', 400));
  if (!validator.isEmail(email))
    return next(new AppError('Email is not valid email address!', 400));

  const newUser = await User({
    fullName,
    email,
    password,
  });
  newUser.save();
  res.status(201).json({
    newUser,
  });
});

exports.loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('Email or Password are wrong 😞!', 400));

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return next(new AppError('Email or Password is wrong 😞!', 400));
  req.session.user = user;

  // console.log(req.session.user.email);

  res.status(200).json({
    user,
  });
});

exports.deleteAccountController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedAccount = await User.findByIdAndDelete(id);
  req.session.destroy();
  res.status(204).json({
    message: 'Your account deleted successfully',
  });
});

exports.updateUserController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ email: req.body.email });

  if (!(req.session.user.email === req.body?.email)) {
    if (user) return next(new AppError('This email is already taken!', 400));
  }
  if (!validator.isEmail(req.body.email))
    return next(new AppError('Please enter a valid email address', 400));

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      fullName: req.body.fullName,
      email: req.body.email,
    },
    { new: true },
  );
  res.status(200).json({
    updatedUser,
  });
});

exports.changeProfileImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      image: req.file.filename,
    },
    { new: true },
  );
  req.session.user = updatedUser;

  res.status(200).json({
    updatedUser,
  });
});

exports.changePasswordController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ _id: id });

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect)
    return next(new AppError('Current password is not correct 😥!', 400));
  if (!(newPassword === confirmPassword))
    return next(new AppError('Passwords are not the same 😥!', 400));

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  console.log(hashedPassword);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true },
  );

  req.session.user = updatedUser;
  res.status(200).json({
    updatedUser,
  });
});
