const express = require('express');
const diaryController = require('./../controllers/diaryController');

const router = express.Router();

router.route('/add-diary/:id').post(diaryController.createDiaryCOntroller);
router.route('/all-diary/:id').get(diaryController.getAllDiariesController);
router.route('/get-diary/:id').post(diaryController.getFewDiaryController);
router.route('/get-one-diary').post(diaryController.getOneDiarController);
router.route('/edit-diary/:diaryId').post(diaryController.editDiaryController);
router
  .route('/delete-diary/:diaryId')
  .post(diaryController.deleteDiaryController);

module.exports = router;
