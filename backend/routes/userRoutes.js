import express from 'express';
import {
    registerUser,
    loginUser,
    promoteToAdmin
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only route
router.put('/promote', protect, admin, promoteToAdmin);


export default router;
