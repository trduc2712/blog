import { Router } from 'express';
const router = Router();
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
