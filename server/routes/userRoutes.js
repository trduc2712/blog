const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/count', userController.getUserCount);
router.get('/paginate', userController.getUsersWithPagination);
router.put('/update-current-user/:id', userController.updateCurrentUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
