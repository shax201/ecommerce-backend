import mongoose from 'mongoose';
import { ProductWishlistModel, TProductWishlist } from './productWishlist.model';
import { ProductModel } from './product.model';
import { ProductAnalyticsService } from './productAnalytics.service';

export interface WishlistFilters {
  userId: string;
  priority?: 'low' | 'medium' | 'high';
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'addedAt' | 'priority' | 'productTitle';
  sortOrder?: 'asc' | 'desc';
}

export interface WishlistStats {
  totalItems: number;
  activeItems: number;
  priorityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  totalValue: number;
  averageItemPrice: number;
  oldestItem?: Date;
  newestItem?: Date;
}

export class ProductWishlistService {
  /**
   * Add product to wishlist
   */
  static async addToWishlist(
    userId: string,
    productId: string,
    notes?: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<TProductWishlist> {
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if already in wishlist
    const existingItem = await ProductWishlistModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (existingItem) {
      if (existingItem.isActive) {
        throw new Error('Product is already in your wishlist');
      } else {
        // Reactivate the item
        existingItem.isActive = true;
        existingItem.addedAt = new Date();
        existingItem.notes = notes;
        existingItem.priority = priority;
        await existingItem.save();
        return existingItem;
      }
    }

    // Create new wishlist item
    const wishlistItem = new ProductWishlistModel({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
      notes,
      priority
    });

    await wishlistItem.save();

    // Update product analytics
    await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.wishlistCount': 1 } }
    );

    return wishlistItem;
  }

  /**
   * Remove product from wishlist
   */
  static async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistItem = await ProductWishlistModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (!wishlistItem) {
      throw new Error('Product not found in wishlist');
    }

    // Soft delete by setting isActive to false
    wishlistItem.isActive = false;
    await wishlistItem.save();

    // Update product analytics
    await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.wishlistCount': -1 } }
    );

    return true;
  }

  /**
   * Get user's wishlist
   */
  static async getWishlist(filters: WishlistFilters): Promise<{
    items: TProductWishlist[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      userId,
      priority,
      isActive = true,
      page = 1,
      limit = 20,
      sortBy = 'addedAt',
      sortOrder = 'desc'
    } = filters;

    const matchStage: any = {
      userId: new mongoose.Types.ObjectId(userId),
      isActive
    };

    if (priority) {
      matchStage.priority = priority;
    }

    const skip = (page - 1) * limit;
    const sortStage: any = {};
    
    if (sortBy === 'productTitle') {
      sortStage['product.title'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          userId: 1,
          productId: 1,
          addedAt: 1,
          notes: 1,
          priority: 1,
          isActive: 1,
          product: {
            _id: 1,
            title: 1,
            primaryImage: 1,
            regularPrice: 1,
            discountPrice: 1,
            status: 1,
            'inventory.availableStock': 1,
            'analytics.averageRating': 1,
            'analytics.totalReviews': 1
          }
        }
      }
    ];

    const [items, total] = await Promise.all([
      ProductWishlistModel.aggregate(pipeline),
      ProductWishlistModel.countDocuments(matchStage)
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Check if product is in wishlist
   */
  static async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistItem = await ProductWishlistModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
      isActive: true
    });

    return !!wishlistItem;
  }

  /**
   * Update wishlist item
   */
  static async updateWishlistItem(
    userId: string,
    productId: string,
    updates: {
      notes?: string;
      priority?: 'low' | 'medium' | 'high';
    }
  ): Promise<TProductWishlist | null> {
    const wishlistItem = await ProductWishlistModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
      isActive: true
    });

    if (!wishlistItem) {
      throw new Error('Product not found in wishlist');
    }

    if (updates.notes !== undefined) {
      wishlistItem.notes = updates.notes;
    }
    if (updates.priority !== undefined) {
      wishlistItem.priority = updates.priority;
    }

    await wishlistItem.save();
    return wishlistItem;
  }

  /**
   * Get wishlist statistics
   */
  static async getWishlistStats(userId: string): Promise<WishlistStats> {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          priorityDistribution: {
            $push: '$priority'
          },
          totalValue: {
            $sum: '$product.discountPrice'
          },
          averageItemPrice: {
            $avg: '$product.discountPrice'
          },
          oldestItem: { $min: '$addedAt' },
          newestItem: { $max: '$addedAt' }
        }
      }
    ];

    const [result] = await ProductWishlistModel.aggregate(pipeline);

    if (!result) {
      return {
        totalItems: 0,
        activeItems: 0,
        priorityDistribution: { low: 0, medium: 0, high: 0 },
        totalValue: 0,
        averageItemPrice: 0
      };
    }

    // Calculate priority distribution
    const priorityDistribution = { low: 0, medium: 0, high: 0 };
    result.priorityDistribution.forEach((priority: string) => {
      if (priority in priorityDistribution) {
        priorityDistribution[priority as keyof typeof priorityDistribution]++;
      }
    });

    return {
      totalItems: result.totalItems,
      activeItems: result.totalItems,
      priorityDistribution,
      totalValue: Math.round(result.totalValue * 100) / 100,
      averageItemPrice: Math.round(result.averageItemPrice * 100) / 100,
      oldestItem: result.oldestItem,
      newestItem: result.newestItem
    };
  }

  /**
   * Get wishlist recommendations based on user's wishlist
   */
  static async getWishlistRecommendations(userId: string, limit: number = 10): Promise<any[]> {
    // Get user's wishlist categories
    const userWishlist = await ProductWishlistModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true
    }).populate('productId', 'catagory');

    if (userWishlist.length === 0) {
      // If no wishlist, return popular products
      return await ProductAnalyticsService.getProductPerformanceMetrics(undefined, limit);
    }

    // Extract categories from wishlist
    const categories = userWishlist.map(item => 
      (item.productId as any).catagory
    ).flat();

    // Get recommended products from same categories
    const pipeline = [
      {
        $match: {
          _id: { $nin: userWishlist.map(item => item.productId) },
          status: 'active',
          catagory: { $in: categories }
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $size: {
              $setIntersection: ['$catagory', categories]
            }
          }
        }
      },
      { $sort: { relevanceScore: -1, 'analytics.views': -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          primaryImage: 1,
          regularPrice: 1,
          discountPrice: 1,
          'analytics.averageRating': 1,
          'analytics.totalReviews': 1,
          'seo.slug': 1
        }
      }
    ];

    return await ProductModel.aggregate(pipeline);
  }

  /**
   * Clear entire wishlist
   */
  static async clearWishlist(userId: string): Promise<number> {
    const result = await ProductWishlistModel.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isActive: true },
      { isActive: false }
    );

    return result.modifiedCount;
  }

  /**
   * Get wishlist items by priority
   */
  static async getWishlistByPriority(
    userId: string,
    priority: 'low' | 'medium' | 'high'
  ): Promise<TProductWishlist[]> {
    return await ProductWishlistModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      priority,
      isActive: true
    })
    .populate('productId', 'title primaryImage regularPrice discountPrice status')
    .sort({ addedAt: -1 })
    .lean();
  }

  /**
   * Move wishlist item to cart (placeholder for cart integration)
   */
  static async moveToCart(userId: string, productId: string): Promise<boolean> {
    // This would integrate with cart service
    // For now, just remove from wishlist
    await this.removeFromWishlist(userId, productId);
    return true;
  }
}
