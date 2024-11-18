import { Router } from 'express';
const router = Router();
import {
  login,
  getLoggedInUser,
  logout,
} from '../controllers/authController.js';

router.post('/login', login);
router.get('/me', getLoggedInUser);
router.get('/logout', logout);

export default router;
