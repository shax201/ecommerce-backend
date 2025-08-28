import express from 'express';
import { CatagoryControllers } from './catagory.controller';

const router = express.Router();

router.get('/', CatagoryControllers.getCatagory);
router.get('/:id', CatagoryControllers.getSingleCatagory);
router.post('/create', CatagoryControllers.createCatagory);
router.put('/:id', CatagoryControllers.updateCatagory);
router.delete('/:id', CatagoryControllers.deleteCatagory);

export const CatagoryRoutes = router;