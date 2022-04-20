const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

router.route('/user-info/:id').get(userController.getUserInfo);
router.route('/users').get(userController.getAllUser);

module.exports = router;
