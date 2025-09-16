import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";

const router = Router();

// CRUD operations (Admin only)
router.post("/", 
  authMiddleware, 
  requirePermission('coupons', 'create'), 
  CouponController.create
);

router.put("/:id", 
  authMiddleware, 
  requirePermission('coupons', 'update'), 
  CouponController.update
);

router.get("/:id", 
  authMiddleware, 
  requirePermission('coupons', 'read'), 
  CouponController.getById
);

router.get("/", 
  authMiddleware, 
  requirePermission('coupons', 'read'), 
  CouponController.getAll
);

router.delete("/:id", 
  authMiddleware, 
  requirePermission('coupons', 'delete'), 
  CouponController.delete
);

// Coupon management (Admin only)
router.patch("/:id/deactivate", 
  authMiddleware, 
  requirePermission('coupons', 'update'), 
  CouponController.deactivate
);

router.patch("/:id/activate", 
  authMiddleware, 
  requirePermission('coupons', 'update'), 
  CouponController.activate
);

// Coupon validation and application (Public - for customers)
router.post("/validate", CouponController.validateCoupon);
router.post("/apply", CouponController.applyCoupon);

// Get active coupons (Public - for customers)
router.get("/active/list", CouponController.getActiveCoupons);

export const CouponRoutes = router;
