const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPostBySlug);
router.post('/', postController.createPost);

module.exports = router;
