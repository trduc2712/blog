const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUserById);
router.get('/count', userController.getUserCount);
router.get('/paginate', userController.getUserWithPagination);

module.exports = router;
