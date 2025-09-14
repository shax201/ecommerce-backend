import { Router } from "express";
import { CouponController } from "./coupon.controller";

const router = Router();

// CRUD operations
router.post("/", CouponController.create);
router.put("/:id", CouponController.update);
router.get("/:id", CouponController.getById);
router.get("/", CouponController.getAll);
router.delete("/:id", CouponController.delete);

// Coupon management
router.patch("/:id/deactivate", CouponController.deactivate);
router.patch("/:id/activate", CouponController.activate);

// Coupon validation and application
router.post("/validate", CouponController.validateCoupon);
router.post("/apply", CouponController.applyCoupon);

// Get active coupons
router.get("/active/list", CouponController.getActiveCoupons);

export const CouponRoutes = router;
