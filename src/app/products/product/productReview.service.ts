import mongoose from 'mongoose';
import { ProductReviewModel, TProductReview } from './productReview.model';
import { ProductModel } from './product.model';
import { ProductAnalyticsService } from './productAnalytics.service';

export interface CreateReviewData {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedReviews: number;
  pendingReviews: number;
  recentReviews: number;
}

export class ProductReviewService {
  /**
   * Create a new product review
   */
  static async createReview(reviewData: CreateReviewData): Promise<TProductReview> {
    // Check if user has already reviewed this product
    const existingReview = await ProductReviewModel.findOne({
      productId: reviewData.productId,
      userId: reviewData.userId
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Verify the product exists
    const product = await ProductModel.findById(reviewData.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const review = new ProductReviewModel(reviewData);
    await review.save();

    // Update product analytics
    await ProductAnalyticsService.updateProductRating(reviewData.productId, reviewData.rating);

    return review;
  }

  /**
   * Get reviews with filters and pagination
   */
  static async getReviews(filters: ReviewFilters = {}): Promise<{
    reviews: TProductReview[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      productId,
      userId,
      rating,
      status = 'approved',
      verified,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const matchStage: any = {};
    
    if (productId) matchStage.productId = new mongoose.Types.ObjectId(productId);
    if (userId) matchStage.userId = new mongoose.Types.ObjectId(userId);
    if (rating) matchStage.rating = rating;
    if (status) matchStage.status = status;
    if (verified !== undefined) matchStage.verified = verified;

    const skip = (page - 1) * limit;
    const sortStage: any = {};
    sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [reviews, total] = await Promise.all([
      ProductReviewModel.find(matchStage)
        .sort(sortStage)
        .skip(skip)
        .limit(limit)
        .populate('productId', 'title primaryImage')
        .populate('userId', 'firstName lastName email')
        .lean(),
      ProductReviewModel.countDocuments(matchStage)
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get review by ID
   */
  static async getReviewById(reviewId: string): Promise<TProductReview | null> {
    return await ProductReviewModel.findById(reviewId)
      .populate('productId', 'title primaryImage')
      .populate('userId', 'firstName lastName email')
      .lean();
  }

  /**
   * Update review
   */
  static async updateReview(
    reviewId: string,
    updateData: UpdateReviewData,
    userId: string
  ): Promise<TProductReview | null> {
    const review = await ProductReviewModel.findOne({
      _id: reviewId,
      userId: userId
    });

    if (!review) {
      throw new Error('Review not found or you are not authorized to update it');
    }

    const updatedReview = await ProductReviewModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    ).populate('productId', 'title primaryImage')
     .populate('userId', 'firstName lastName email');

    // Update product analytics if rating changed
    if (updateData.rating && updateData.rating !== review.rating) {
      await ProductAnalyticsService.updateProductRating(
        review.productId.toString(),
        updateData.rating
      );
    }

    return updatedReview;
  }

  /**
   * Delete review
   */
  static async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await ProductReviewModel.findOne({
      _id: reviewId,
      userId: userId
    });

    if (!review) {
      throw new Error('Review not found or you are not authorized to delete it');
    }

    await ProductReviewModel.findByIdAndDelete(reviewId);
    return true;
  }

  /**
   * Mark review as helpful
   */
  static async markHelpful(reviewId: string, helpful: boolean): Promise<TProductReview | null> {
    const updateField = helpful ? 'helpful' : 'notHelpful';
    return await ProductReviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );
  }

  /**
   * Get review statistics for a product
   */
  static async getReviewStats(productId: string): Promise<ReviewStats> {
    const pipeline = [
      { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          },
          verifiedReviews: {
            $sum: { $cond: ['$verified', 1, 0] }
          },
          recentReviews: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    const [result] = await ProductReviewModel.aggregate(pipeline);
    
    if (!result) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedReviews: 0,
        pendingReviews: 0,
        recentReviews: 0
      };
    }

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    result.ratingDistribution.forEach((rating: number) => {
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      }
    });

    // Get pending reviews count
    const pendingCount = await ProductReviewModel.countDocuments({
      productId: new mongoose.Types.ObjectId(productId),
      status: 'pending'
    });

    return {
      totalReviews: result.totalReviews,
      averageRating: Math.round(result.averageRating * 100) / 100,
      ratingDistribution,
      verifiedReviews: result.verifiedReviews,
      pendingReviews: pendingCount,
      recentReviews: result.recentReviews
    };
  }

  /**
   * Admin: Update review status
   */
  static async updateReviewStatus(
    reviewId: string,
    status: 'pending' | 'approved' | 'rejected',
    adminId: string
  ): Promise<TProductReview | null> {
    const updateData: any = { status };
    
    if (status === 'approved') {
      updateData.verified = true;
    }

    return await ProductReviewModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    );
  }

  /**
   * Admin: Add response to review
   */
  static async addAdminResponse(
    reviewId: string,
    response: string,
    adminId: string
  ): Promise<TProductReview | null> {
    return await ProductReviewModel.findByIdAndUpdate(
      reviewId,
      {
        'adminResponse.response': response,
        'adminResponse.respondedBy': new mongoose.Types.ObjectId(adminId),
        'adminResponse.respondedAt': new Date()
      },
      { new: true }
    );
  }

  /**
   * Get recent reviews across all products
   */
  static async getRecentReviews(limit: number = 10): Promise<TProductReview[]> {
    return await ProductReviewModel.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('productId', 'title primaryImage')
      .populate('userId', 'firstName lastName')
      .lean();
  }

  /**
   * Get top rated products based on reviews
   */
  static async getTopRatedProducts(limit: number = 10): Promise<any[]> {
    const pipeline = [
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$productId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          verifiedReviews: {
            $sum: { $cond: ['$verified', 1, 0] }
          }
        }
      },
      {
        $match: {
          totalReviews: { $gte: 5 }, // At least 5 reviews
          averageRating: { $gte: 4.0 } // At least 4.0 average rating
        }
      },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          title: '$product.title',
          primaryImage: '$product.primaryImage',
          regularPrice: '$product.regularPrice',
          discountPrice: '$product.discountPrice',
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: '$totalReviews',
          verifiedReviews: '$verifiedReviews'
        }
      }
    ];

    return await ProductReviewModel.aggregate(pipeline);
  }
}
