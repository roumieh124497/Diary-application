const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginController);
router
  .route('/delete-account/:id')
  .delete(authController.deleteAccountController);
router.route('/update-user/:id').patch(authController.updateUserController);
router
  .route('/change-image/:id')
  .post(
    authController.upload.single('profile'),
    authController.changeProfileImage,
  );
router
  .route('/change-password/:id')
  .patch(authController.changePasswordController);

module.exports = router;
