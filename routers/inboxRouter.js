const express = require('express');
const inboxController = require('./../controllers/inboxController');

const router = express.Router();

router.route('/get-inbox').post(inboxController.getDiayController);
router.route('/get-inbox-one/:id').get(inboxController.getOneInboxController);
router.route('/update-inbox/:id').get(inboxController.updateInbox);

module.exports = router;
