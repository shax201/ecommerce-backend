import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouponUsage {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
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
  applicableCategories?: mongoose.Types.ObjectId[];
  applicableProducts?: mongoose.Types.ObjectId[];
  userRestrictions?: {
    firstTimeUsersOnly?: boolean;
    specificUsers?: mongoose.Types.ObjectId[];
    excludeUsers?: mongoose.Types.ObjectId[];
  };
  usageHistory: ICouponUsage[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponUsageSchema = new Schema<ICouponUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    discountAmount: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      max: 100000
    },
    minimumOrderValue: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    maximumDiscountAmount: {
      type: Number,
      min: 0
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now
    },
    validTo: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicableCategories: [{
      type: Schema.Types.ObjectId,
      ref: "Catagory"
    }],
    applicableProducts: [{
      type: Schema.Types.ObjectId,
      ref: "Product"
    }],
    userRestrictions: {
      firstTimeUsersOnly: { type: Boolean, default: false },
      specificUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      excludeUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
    },
    usageHistory: [CouponUsageSchema],
  },
  { timestamps: true }
);

// Indexes for performance
// code index is automatically created by unique: true
CouponSchema.index({ isActive: 1, validTo: 1 });
CouponSchema.index({ applicableCategories: 1 });
CouponSchema.index({ applicableProducts: 1 });

// Pre-save middleware to validate discount value based on type
CouponSchema.pre('save', function(next) {
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  if (this.discountType === 'percentage' && !this.maximumDiscountAmount) {
    // For percentage discounts, maximum discount amount should be set
    next(new Error('Maximum discount amount is required for percentage discounts'));
  }
  next();
});

// Virtual for checking if coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validTo;
});

// Virtual for checking if coupon is valid (active and not expired)
CouponSchema.virtual('isValid').get(function() {
  return this.isActive && new Date() <= this.validTo && this.usageCount < this.usageLimit;
});

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", CouponSchema);
