import express from 'express';
import { ClientsControllers, updateClientPassword } from './client.controller';

const router = express.Router();

// Public routes
router.post('/', ClientsControllers.createClient);
router.post('/login', ClientsControllers.loginClient);

// Protected routes - require authentication
router.get('/',  ClientsControllers.getAllClient);
router.get('/:id', ClientsControllers.getClientById);
router.put('/profile/:id', ClientsControllers.updateClientProfile);
router.put('/:id', ClientsControllers.updateClient);
router.put("/:clientId/password", updateClientPassword);
router.delete('/:id', ClientsControllers.deleteClient);

export const ClientsRoutes = router;
