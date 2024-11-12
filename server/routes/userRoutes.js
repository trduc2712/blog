const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/update-user/:id', userController.updateUser);

module.exports = router;
