import express from 'express';
import { CourierCredentialsController } from './courierCredentials.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { 
  createCourierCredentialsValidation, 
  updateCourierCredentialsValidation, 
  courierParamValidation,
  handleValidationErrors 
} from './courierCredentials.validation';

const router = express.Router();
const courierCredentialsController = new CourierCredentialsController();

// All routes require authentication and courier management permissions
router.use(authMiddleware);
router.use(requirePermission('courier', 'read'));

// Get all credentials
router.get('/', courierCredentialsController.getAllCredentials.bind(courierCredentialsController));

// Get active couriers
router.get('/active', courierCredentialsController.getActiveCouriers.bind(courierCredentialsController));

// Get credentials by courier
router.get('/:courier', 
  courierParamValidation,
  handleValidationErrors,
  courierCredentialsController.getCredentialsByCourier.bind(courierCredentialsController)
);

// Create credentials (requires create permission)
router.post('/', 
  requirePermission('courier', 'create'),
  createCourierCredentialsValidation,
  handleValidationErrors,
  courierCredentialsController.createCredentials.bind(courierCredentialsController)
);

// Update credentials (requires update permission)
router.put('/:courier', 
  requirePermission('courier', 'update'),
  updateCourierCredentialsValidation,
  handleValidationErrors,
  courierCredentialsController.updateCredentials.bind(courierCredentialsController)
);

// Toggle credentials status (requires update permission)
router.patch('/:courier/status', 
  requirePermission('courier', 'update'),
  courierParamValidation,
  handleValidationErrors,
  courierCredentialsController.toggleCredentialsStatus.bind(courierCredentialsController)
);

// Delete credentials (requires delete permission)
router.delete('/:courier', 
  requirePermission('courier', 'delete'),
  courierParamValidation,
  handleValidationErrors,
  courierCredentialsController.deleteCredentials.bind(courierCredentialsController)
);

export const CourierCredentialsRoutes = router;
