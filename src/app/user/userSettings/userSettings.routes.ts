import express from 'express';
import { UserSettingsControllers } from './userSettings.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = express.Router();

// All routes require authentication (user must be logged in)
router.use(authMiddleware);

// Get user's own profile
router.get('/profile', UserSettingsControllers.getOwnProfile);

// Update user's own profile (names only)
router.put('/profile', UserSettingsControllers.updateOwnProfile);

// Update user's own email
router.put('/email', UserSettingsControllers.updateOwnEmail);

// Change user's own password
router.put('/password', UserSettingsControllers.changeOwnPassword);

// Update user's own phone
router.put('/phone', UserSettingsControllers.updateOwnPhone);

// Get user's own preferences
router.get('/preferences', UserSettingsControllers.getOwnPreferences);

// Update user's own preferences
router.put('/preferences', UserSettingsControllers.updateOwnPreferences);

export const UserSettingsRoutes = router;
