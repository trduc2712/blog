const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/paginate', postController.getPostsWithPagination);
router.get('/count', postController.getPostCount);
router.get('/:slug', postController.getPostBySlug);
router.post('/', postController.createPost);
router.delete('/:id', postController.deletePostById);

module.exports = router;
