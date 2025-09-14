import { Request, Response } from "express";
import { couponCreateSchema, couponUpdateSchema } from "./coupon.validation";
import { CouponService } from "./coupon.service";

export const CouponController = {
  async create(req: Request, res: Response) {
    try {
      const validated = couponCreateSchema.parse(req.body);
      const created = await CouponService.create(validated);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validated = couponUpdateSchema.parse(req.body);
      const updated = await CouponService.update(id, validated);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Coupon not found" });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const coupon = await CouponService.getById(id);
      if (!coupon) {
        return res.status(404).json({ success: false, error: "Coupon not found" });
      }
      res.json({ success: true, data: coupon });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, isActive, search } = req.query;
      const filters: any = {};

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      if (search) {
        filters.$or = [
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const coupons = await CouponService.getAll(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );
      res.json({ success: true, data: coupons });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CouponService.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Coupon not found" });
      }
      res.json({ success: true, message: "Coupon deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async validateCoupon(req: Request, res: Response) {
    try {
      const { code, orderValue, userId, productIds, categoryIds } = req.body;

      const validation = await CouponService.validateCoupon({
        code,
        orderValue,
        userId,
        productIds,
        categoryIds
      });

      res.json({ success: true, data: validation });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async applyCoupon(req: Request, res: Response) {
    try {
      const { code, orderValue, userId, productIds, categoryIds } = req.body;

      const result = await CouponService.applyCoupon({
        code,
        orderValue,
        userId,
        productIds,
        categoryIds
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async getActiveCoupons(req: Request, res: Response) {
    try {
      const coupons = await CouponService.getActiveCoupons();
      res.json({ success: true, data: coupons });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async deactivate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CouponService.deactivate(id);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Coupon not found" });
      }
      res.json({ success: true, message: "Coupon deactivated successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async activate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CouponService.activate(id);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Coupon not found" });
      }
      res.json({ success: true, message: "Coupon activated successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
