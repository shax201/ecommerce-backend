import express from 'express';
import { CourierOrderController } from './courierOrder.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';

const router = express.Router();
const courierOrderController = new CourierOrderController();

// All routes require authentication
router.use(authMiddleware);

// Get all courier orders with pagination and filters (requires read permission)
router.get('/', 
  requirePermission('courier', 'read'),
  courierOrderController.getCourierOrders.bind(courierOrderController)
);

// Get courier orders statistics (requires read permission)
router.get('/stats/overview', 
  requirePermission('courier', 'read'),
  courierOrderController.getCourierOrdersStats.bind(courierOrderController)
);

// Create order with courier (requires create permission)
router.post('/:orderId/create', 
  requirePermission('courier', 'create'),
  courierOrderController.createOrderWithCourier.bind(courierOrderController)
);

// Update order status from courier (requires update permission)
router.patch('/:orderId/status', 
  requirePermission('courier', 'update'),
  courierOrderController.updateOrderStatus.bind(courierOrderController)
);

// Get order tracking information (requires read permission)
router.get('/:orderId/tracking', 
  requirePermission('courier', 'read'),
  courierOrderController.getOrderTracking.bind(courierOrderController)
);

// Calculate delivery price for an order (requires read permission)
router.post('/:orderId/calculate-price', 
  requirePermission('courier', 'read'),
  courierOrderController.calculateDeliveryPrice.bind(courierOrderController)
);

// Get available couriers for an order (requires read permission)
router.get('/:orderId/available-couriers', 
  requirePermission('courier', 'read'),
  courierOrderController.getAvailableCouriersForOrder.bind(courierOrderController)
);

// Get courier order by ID (requires read permission) - This should be last
router.get('/:orderId', 
  requirePermission('courier', 'read'),
  courierOrderController.getCourierOrderById.bind(courierOrderController)
);

// Delete courier order (requires delete permission)
router.delete('/:orderId', 
  requirePermission('courier', 'delete'),
  courierOrderController.deleteCourierOrder.bind(courierOrderController)
);

// Bulk delete courier orders (requires delete permission)
router.delete('/bulk-delete', 
  requirePermission('courier', 'delete'),
  courierOrderController.bulkDeleteCourierOrders.bind(courierOrderController)
);

export const CourierOrderRoutes = router;
