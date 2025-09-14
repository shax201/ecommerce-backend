import { z } from "zod";

export const couponCreateSchema = z.object({
  code: z.string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(/^[A-Z0-9]+$/, "Coupon code must contain only uppercase letters and numbers")
    .transform(val => val.toUpperCase()),

  description: z.string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters"),

  discountType: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Discount type must be either 'percentage' or 'fixed'" })
  }),

  discountValue: z.number()
    .min(0, "Discount value must be positive")
    .max(100000, "Discount value is too high"),

  minimumOrderValue: z.number()
    .min(0, "Minimum order value must be positive")
    .default(0),

  maximumDiscountAmount: z.number()
    .min(0, "Maximum discount amount must be positive")
    .optional(),

  usageLimit: z.number()
    .min(1, "Usage limit must be at least 1")
    .max(10000, "Usage limit is too high")
    .default(1),

  validFrom: z.string()
    .datetime("Invalid date format for validFrom")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), "Invalid date for validFrom")
    .default(() => new Date().toISOString()),

  validTo: z.string()
    .datetime("Invalid date format for validTo")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), "Invalid date for validTo")
    .refine((date) => date > new Date(), {
      message: "Valid to date must be in the future"
    }),

  applicableCategories: z.array(z.string()).optional(),

  applicableProducts: z.array(z.string()).optional(),

  userRestrictions: z.object({
    firstTimeUsersOnly: z.boolean().default(false),
    specificUsers: z.array(z.string()).optional(),
    excludeUsers: z.array(z.string()).optional(),
  }).optional(),
}).refine((data) => {
  // If discount type is percentage, maximumDiscountAmount is required
  if (data.discountType === 'percentage' && !data.maximumDiscountAmount) {
    return false;
  }
  return true;
}, {
  message: "Maximum discount amount is required for percentage discounts",
  path: ["maximumDiscountAmount"]
}).refine((data) => {
  // If discount type is percentage, discount value should not exceed 100
  if (data.discountType === 'percentage' && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountValue"]
});

export const couponUpdateSchema = z.object({
  description: z.string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),

  discountType: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Discount type must be either 'percentage' or 'fixed'" })
  }).optional(),

  discountValue: z.number()
    .min(0, "Discount value must be positive")
    .max(100000, "Discount value is too high")
    .optional(),

  minimumOrderValue: z.number()
    .min(0, "Minimum order value must be positive")
    .optional(),

  maximumDiscountAmount: z.number()
    .min(0, "Maximum discount amount must be positive")
    .optional(),

  usageLimit: z.number()
    .min(1, "Usage limit must be at least 1")
    .max(10000, "Usage limit is too high")
    .optional(),

  validFrom: z.string()
    .datetime("Invalid date format for validFrom")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), "Invalid date for validFrom")
    .optional(),

  validTo: z.string()
    .datetime("Invalid date format for validTo")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), "Invalid date for validTo")
    .optional(),

  isActive: z.boolean().optional(),

  applicableCategories: z.array(z.string()).optional(),

  applicableProducts: z.array(z.string()).optional(),

  userRestrictions: z.object({
    firstTimeUsersOnly: z.boolean().optional(),
    specificUsers: z.array(z.string()).optional(),
    excludeUsers: z.array(z.string()).optional(),
  }).optional(),
}).refine((data) => {
  // If discount type is being updated to percentage, maximumDiscountAmount is required
  if (data.discountType === 'percentage' && !data.maximumDiscountAmount) {
    return false;
  }
  return true;
}, {
  message: "Maximum discount amount is required for percentage discounts",
  path: ["maximumDiscountAmount"]
}).refine((data) => {
  // If discount type is percentage, discount value should not exceed 100
  if (data.discountType === 'percentage' && data.discountValue && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountValue"]
}).refine((data) => {
  // If both validFrom and validTo are provided, validTo must be after validFrom
  if (data.validFrom && data.validTo && data.validTo <= data.validFrom) {
    return false;
  }
  return true;
}, {
  message: "Valid to date must be after valid from date",
  path: ["validTo"]
});

export const couponValidationSchema = z.object({
  code: z.string()
    .min(1, "Coupon code is required")
    .transform(val => val.toUpperCase()),

  orderValue: z.number()
    .min(0, "Order value must be positive"),

  userId: z.string().optional(),

  productIds: z.array(z.string()).optional(),

  categoryIds: z.array(z.string()).optional(),
});

export const couponApplySchema = z.object({
  code: z.string()
    .min(1, "Coupon code is required")
    .transform(val => val.toUpperCase()),

  orderValue: z.number()
    .min(0, "Order value must be positive"),

  userId: z.string().optional(),

  productIds: z.array(z.string()).optional(),

  categoryIds: z.array(z.string()).optional(),
});
