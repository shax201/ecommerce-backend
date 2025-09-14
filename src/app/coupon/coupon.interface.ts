import { Document } from "mongoose";

export interface ICouponUsage {
  userId: string;
  orderId: string;
  discountAmount: number;
  usedAt: Date;
}

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount?: number;
  usageLimit: number;
  usageCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions?: {
    firstTimeUsersOnly?: boolean;
    specificUsers?: string[];
    excludeUsers?: string[];
  };
  usageHistory: ICouponUsage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICouponCreate {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: Date;
  validTo: Date;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions?: {
    firstTimeUsersOnly?: boolean;
    specificUsers?: string[];
    excludeUsers?: string[];
  };
}

export interface ICouponUpdate {
  description?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: Date;
  validTo?: Date;
  isActive?: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions?: {
    firstTimeUsersOnly?: boolean;
    specificUsers?: string[];
    excludeUsers?: string[];
  };
}

export interface ICouponValidation {
  code: string;
  orderValue: number;
  userId?: string;
  productIds?: string[];
  categoryIds?: string[];
}
