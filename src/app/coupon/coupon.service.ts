import { Coupon, ICoupon } from "./coupon.model";
import { ICouponCreate, ICouponUpdate, ICouponValidation } from "./coupon.interface";

export const CouponService = {
  async create(data: ICouponCreate) {
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    const coupon = new Coupon(data);
    return await coupon.save();
  },

  async update(id: string, data: ICouponUpdate) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return coupon;
  },

  async getById(id: string) {
    return await Coupon.findById(id)
      .populate('applicableCategories', 'title description')
      .populate('applicableProducts', 'name price');
  },

  async getCouponByCode(code: string) {
    return await Coupon.findOne({ code: code.toUpperCase() });
  },

  async getAll(filters: any = {}, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const coupons = await Coupon.find(filters)
      .populate('applicableCategories', 'title description')
      .populate('applicableProducts', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(filters);

    return {
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async delete(id: string) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return null;
    }

    // Check if coupon has been used
    if (coupon.usageCount > 0) {
      throw new Error("Cannot delete coupon that has been used");
    }

    return await Coupon.findByIdAndDelete(id);
  },

  async validateCoupon(validationData: ICouponValidation) {
    const { code, orderValue, userId, productIds, categoryIds } = validationData;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      throw new Error("Coupon is not active");
    }

    // Check if coupon is expired
    if (new Date() > coupon.validTo) {
      throw new Error("Coupon has expired");
    }

    // Check if coupon is valid from date
    if (new Date() < coupon.validFrom) {
      throw new Error("Coupon is not yet valid");
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit exceeded");
    }

    // Check minimum order value
    if (orderValue < coupon.minimumOrderValue) {
      throw new Error(`Minimum order value of $${coupon.minimumOrderValue} required`);
    }

    // Check user restrictions
    if (coupon.userRestrictions) {
      if (coupon.userRestrictions.firstTimeUsersOnly && userId) {
        // Check if user has used any coupons before
        const hasUsedCoupons = await this.hasUserUsedCoupons(userId);
        if (hasUsedCoupons) {
          throw new Error("This coupon is only for first-time users");
        }
      }

      if (coupon.userRestrictions.specificUsers && userId) {
        const isAllowedUser = coupon.userRestrictions.specificUsers.some(
          id => id.toString() === userId
        );
        if (!isAllowedUser) {
          throw new Error("This coupon is not available for your account");
        }
      }

      if (coupon.userRestrictions.excludeUsers && userId) {
        const isExcludedUser = coupon.userRestrictions.excludeUsers.some(
          id => id.toString() === userId
        );
        if (isExcludedUser) {
          throw new Error("This coupon is not available for your account");
        }
      }
    }

    // Check product/category restrictions
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0 && productIds) {
      const hasApplicableProduct = productIds.some(productId =>
        coupon.applicableProducts?.some(applicableId =>
          applicableId.toString() === productId
        )
      );
      if (!hasApplicableProduct) {
        throw new Error("This coupon is not applicable to the selected products");
      }
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0 && categoryIds) {
      const hasApplicableCategory = categoryIds.some(categoryId =>
        coupon.applicableCategories?.some(applicableId =>
          applicableId.toString() === categoryId
        )
      );
      if (!hasApplicableCategory) {
        throw new Error("This coupon is not applicable to the selected categories");
      }
    }

    return {
      isValid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderValue: coupon.minimumOrderValue,
        maximumDiscountAmount: coupon.maximumDiscountAmount
      }
    };
  },

  async applyCoupon(validationData: ICouponValidation) {
    const validation = await this.validateCoupon(validationData);
    const { code, orderValue } = validationData;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    let discountAmount = 0;

    if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, orderValue);
    } else {
      // Percentage discount
      discountAmount = (orderValue * coupon.discountValue) / 100;
      if (coupon.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
      }
    }

    return {
      ...validation,
      discountAmount,
      finalAmount: orderValue - discountAmount
    };
  },

  async getActiveCoupons() {
    const now = new Date();
    return await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validTo: { $gte: now },
      usageCount: { $lt: { $ifNull: ['$usageLimit', Number.MAX_SAFE_INTEGER] } }
    })
    .populate('applicableCategories', 'title description')
    .populate('applicableProducts', 'name price')
    .sort({ createdAt: -1 });
  },

  async deactivate(id: string) {
    return await Coupon.findByIdAndUpdate(id, { isActive: false }, { new: true });
  },

  async activate(id: string) {
    return await Coupon.findByIdAndUpdate(id, { isActive: true }, { new: true });
  },

  async recordUsage(couponId: string, userId: string, orderId: string, discountAmount: number) {
    return await Coupon.findByIdAndUpdate(
      couponId,
      {
        $inc: { usageCount: 1 },
        $push: {
          usageHistory: {
            userId,
            orderId,
            discountAmount,
            usedAt: new Date()
          }
        }
      },
      { new: true }
    );
  },

  async hasUserUsedCoupons(userId: string): Promise<boolean> {
    const result = await Coupon.findOne({
      'usageHistory.userId': userId
    });
    return !!result;
  },

  async getCouponUsageStats(couponId: string) {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    return {
      code: coupon.code,
      usageCount: coupon.usageCount,
      usageLimit: coupon.usageLimit,
      remainingUses: coupon.usageLimit - coupon.usageCount,
      totalDiscountGiven: coupon.usageHistory.reduce((sum, usage) => sum + usage.discountAmount, 0),
      lastUsed: coupon.usageHistory.length > 0 ?
        coupon.usageHistory[coupon.usageHistory.length - 1].usedAt : null
    };
  }
};
