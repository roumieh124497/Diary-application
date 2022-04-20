const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Diary = require('./../models/DiaryModel');
exports.createDiaryCOntroller = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title === '')
    return next(new AppError('Please write a title for your diary 😄!', 400));
  if (req.body.date === '')
    return next(new AppError('Please choose a date 😄!', 400));
  if (req.body.diary === '')
    return next(new AppError('Please write a diary 😄!', 400));
  if (req.body.feeling === '')
    return next(new AppError('Please put your feeling 😄!', 400));
  const diary = await Diary({
    title: req.body.title,
    date: req.body.date,
    diary: req.body.diary,
    feeling: req.body.feeling,
    userId: id,
  });
  diary.save(err => {
    console.log(err);
  });
  res.status(201).json({
    message: 'success',
  });
});

exports.getAllDiariesController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const diaries = await Diary.find({ userId: id }).sort({ date: -1 });

  res.status(200).json({
    diaries,
  });
});
exports.getFewDiaryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const diaries = await Diary.find({
    $and: [{ userId: id }, { date: req.body.date }],
  });

  res.status(200).json({
    diaries,
  });
});
exports.getOneDiarController = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const diary = await Diary.findOne({ _id: id });

  res.status(200).json({
    diary,
  });
});

exports.editDiaryController = catchAsync(async (req, res, next) => {
  const { diaryId } = req.params;
  const { title, date, diary } = req.body;
  console.log(req.body);
  if (req.body.title === '')
    return next(new AppError('Please write a title for your diary 😄!', 400));
  if (req.body.date === '')
    return next(new AppError('Please choose a date 😄!', 400));
  if (req.body.diary === '')
    return next(new AppError('Please write a diary 😄!', 400));
  const updatedDiary = await Diary.findByIdAndUpdate(diaryId, {
    title,
    date,
    diary,
  });

  res.status(204).json({
    updatedDiary,
  });
});

exports.deleteDiaryController = catchAsync(async (req, res, next) => {
  const { diaryId } = req.params;

  const deletedDiary = await Diary.remove({ _id: diaryId });

  res.status(204).json({
    deletedDiary,
  });
});
