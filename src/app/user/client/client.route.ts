import express from 'express';
import { ClientsControllers, updateClientPassword } from './client.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { requirePermission } from '../../../middlewares/permission.middleware';

const router = express.Router();

// Public routes
router.post('/', ClientsControllers.createClient);
router.post('/login', ClientsControllers.loginClient);

// Protected routes - require authentication and permissions
router.get('/', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  ClientsControllers.getAllClient
);

router.get('/:id', 
  authMiddleware, 
  requirePermission('users', 'read'), 
  ClientsControllers.getClientById
);

router.put('/profile/:id', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  ClientsControllers.updateClientProfile
);

router.put('/:id', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  ClientsControllers.updateClient
);

router.put("/:clientId/password", 
  authMiddleware, 
  requirePermission('users', 'update'), 
  updateClientPassword
);

router.delete('/:id', 
  authMiddleware, 
  requirePermission('users', 'delete'), 
  ClientsControllers.deleteClient
);

// Bulk operations
router.put('/bulk/status', 
  authMiddleware, 
  requirePermission('users', 'update'), 
  ClientsControllers.bulkUpdateClientStatus
);

router.delete('/bulk/delete', 
  authMiddleware, 
  requirePermission('users', 'delete'), 
  ClientsControllers.bulkDeleteClients
);

export const ClientsRoutes = router;
