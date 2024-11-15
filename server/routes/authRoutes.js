const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.get('/get-logged-in-user', authController.getLoggedInUser);
router.get('/logout', authController.logout);
router.get('/check-admin', authController.checkAdmin);

module.exports = router;
