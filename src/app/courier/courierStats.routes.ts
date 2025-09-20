import express from 'express';
import { CourierStatsController } from './courierStats.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

const router = express.Router();
const courierStatsController = new CourierStatsController();

// All routes require authentication
router.use(authMiddleware);

// Get comprehensive courier statistics (requires read permission)
router.get('/stats', 
  requirePermission('courier', 'read'),
  courierStatsController.getCourierStats.bind(courierStatsController)
);

// Get courier performance metrics (requires read permission)
router.get('/performance/:courier', 
  requirePermission('courier', 'read'),
  courierStatsController.getCourierPerformance.bind(courierStatsController)
);

// Test endpoint to seed courier orders (development only)
router.post('/seed-test-orders', 
  courierStatsController.seedTestCourierOrders.bind(courierStatsController)
);

export const CourierStatsRoutes = router;
