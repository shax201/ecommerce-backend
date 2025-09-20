import express from 'express';
import { CourierOperationsController } from './courierOperations.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { 
  courierParamValidation,
  courierOrderValidation,
  courierBulkOrderValidation,
  courierStatusValidation,
  courierPriceValidation,
  handleValidationErrors 
} from './courierCredentials.validation';

const router = express.Router();
const courierOperationsController = new CourierOperationsController();

// All routes require authentication
router.use(authMiddleware);

// Get available couriers (requires read permission)
router.get('/available', 
  requirePermission('courier', 'read'),
  courierOperationsController.getAvailableCouriers.bind(courierOperationsController)
);

// Validate courier credentials (requires read permission)
router.get('/validate/:courier', 
  requirePermission('courier', 'read'),
  courierParamValidation,
  handleValidationErrors,
  courierOperationsController.validateCourier.bind(courierOperationsController)
);

// Create order (requires create permission)
router.post('/:courier/order', 
  requirePermission('courier', 'create'),
  courierParamValidation,
  courierOrderValidation,
  handleValidationErrors,
  courierOperationsController.createOrder.bind(courierOperationsController)
);

// Create bulk orders (requires create permission)
router.post('/:courier/bulk-order', 
  requirePermission('courier', 'create'),
  courierParamValidation,
  courierBulkOrderValidation,
  handleValidationErrors,
  courierOperationsController.bulkOrder.bind(courierOperationsController)
);

// Get order status (requires read permission)
router.get('/:courier/status/:consignmentId', 
  requirePermission('courier', 'read'),
  courierParamValidation,
  courierStatusValidation,
  handleValidationErrors,
  courierOperationsController.getOrderStatus.bind(courierOperationsController)
);

// Calculate price (requires read permission)
router.post('/:courier/calculate-price', 
  requirePermission('courier', 'read'),
  courierParamValidation,
  courierPriceValidation,
  handleValidationErrors,
  courierOperationsController.calculatePrice.bind(courierOperationsController)
);

export const CourierOperationsRoutes = router;
