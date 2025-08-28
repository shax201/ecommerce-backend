import express from 'express';
import { AdminControllers } from './admin.controller';

const router = express.Router();

// Public routes
router.post('/', AdminControllers.createAdmin);
router.post('/login', AdminControllers.loginAdmin);

// Protected routes - require authentication
router.get('/', AdminControllers.getAllAdmin);
router.get('/:id', AdminControllers.getAdminById);
router.put('/:id', AdminControllers.updateAdmin);
router.delete('/:id', AdminControllers.deleteAdmin);

export const AdminRoutes = router; 