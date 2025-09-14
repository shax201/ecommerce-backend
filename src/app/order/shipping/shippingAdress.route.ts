import express from 'express';
import { ShippingAddressControllers } from './shippingAdress.controller';
import { body } from "express-validator";
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = express.Router();

const shippingAddressValidation = [
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("zip").notEmpty().withMessage("Zip code is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("phone")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .notEmpty()
    .withMessage("Phone number is required"),
];

// All routes require authentication
router.post(
  "/",
  authMiddleware,
  shippingAddressValidation,
  ShippingAddressControllers.createShippingAddress
);

router.get('/', authMiddleware, ShippingAddressControllers.getShippingAddress);
router.get('/:id', authMiddleware, ShippingAddressControllers.getShippingAddressById);
router.put("/:id", authMiddleware, shippingAddressValidation, ShippingAddressControllers.updateShippingAddress);
router.patch("/:id/default", authMiddleware, ShippingAddressControllers.setDefaultShippingAddress);
router.delete("/:id", authMiddleware, ShippingAddressControllers.deleteShippingAddress);


export const ShippingAddressRoutes = router;