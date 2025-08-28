import express from 'express';
import { ShippingAddressControllers } from './shippingAdress.controller';
import { body } from "express-validator";

const router = express.Router();


const shippingAddressValidation = [
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("zip").notEmpty().withMessage("Zip code is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("phone")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .notEmpty()
    .withMessage("Phone number is required"),
];

router.post(
  "/",
  shippingAddressValidation,
  ShippingAddressControllers.createShippingAddress
);

router.get('/', ShippingAddressControllers.getShippingAddress );
router.get('/:id', ShippingAddressControllers.getShippingAddressById);
router.put("/:id", shippingAddressValidation, ShippingAddressControllers.updateShippingAddress);
router.patch("/:id/default", ShippingAddressControllers.setDefaultShippingAddress);
router.delete("/:id", ShippingAddressControllers.deleteShippingAddress);


export const ShippingAddressRoutes = router;