const express = require('express');
const notificationController = require('./../controllers/notificationController');

const router = express.Router();

router
  .route('/get-notification')
  .post(notificationController.getNotificationController);

router
  .route('/update-notification/:id')
  .get(notificationController.updatedNotificationController);

module.exports = router;
