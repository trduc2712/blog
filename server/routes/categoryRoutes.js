const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.delete('/:id', categoryController.deleteCategoryById);
router.get('/count', categoryController.getCategoryCount);
router.get('/paginate', categoryController.getCategoriesWithPagination);

module.exports = router;
