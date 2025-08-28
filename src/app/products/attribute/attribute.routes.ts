import express from 'express';
import { ColorControllers, SizeControllers } from './attribute.controller';

const router = express.Router();

// Color routes
router.get('/colors', ColorControllers.getColors);
router.get('/colors/:id', ColorControllers.getSingleColor);
router.post('/colors/create', ColorControllers.createColor);
router.put('/colors/:id', ColorControllers.updateColor);
router.delete('/colors/:id', ColorControllers.deleteColor);

// Size routes
router.get('/sizes', SizeControllers.getSizes);
router.get('/sizes/:id', SizeControllers.getSingleSize);
router.post('/sizes/create', SizeControllers.createSize);
router.put('/sizes/:id', SizeControllers.updateSize);
router.delete('/sizes/:id', SizeControllers.deleteSize);

export const AttributeRoutes = router;