import { Router } from 'express';
const router = Router();
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategoryById,
} from '../controllers/categoryController.js';

router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategoryById);

export default router;
