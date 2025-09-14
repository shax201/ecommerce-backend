import { Request, Response } from 'express';
import { ProductReviewService, CreateReviewData, UpdateReviewData, ReviewFilters } from './productReview.service';
import { OrderErrorHandler, asyncHandler } from '../../order/orderErrorHandler';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { decodeBearerTokenAndGetUserId } from '../../../utils/jwt';
import ClientModel from '../../user/client/client.model';

const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
  if (!userId) {
    userId = req.user?.userId as string | undefined;
  }
  if (!userId && req.user?.email) {
    const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
    if (client?._id) userId = String(client._id);
  }

  if (!userId) {
    throw OrderErrorHandler.createError(
      'UNAUTHORIZED',
      'User authentication required',
      401
    );
  }

  const { productId, rating, title, comment, images } = req.body;

  if (!productId || !rating || !title || !comment) {
    throw OrderErrorHandler.createError(
      'MISSING_FIELDS',
      'Product ID, rating, title, and comment are required',
      400
    );
  }

  if (rating < 1 || rating > 5) {
    throw OrderErrorHandler.createError(
      'INVALID_RATING',
      'Rating must be between 1 and 5',
      400
    );
  }

  const reviewData: CreateReviewData = {
    productId,
    userId,
    userName: req.user?.firstName + ' ' + req.user?.lastName || 'Anonymous',
    userEmail: req.user?.email || '',
    rating,
    title,
    comment,
    images
  };

  const review = await ProductReviewService.createReview(reviewData);

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review,
  });
});

const getReviews = asyncHandler(async (req: Request, res: Response) => {
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
  } = req.query;

  const filters: ReviewFilters = {
    productId: productId as string,
    userId: userId as string,
    rating: rating ? parseInt(rating as string) : undefined,
    status: status as 'pending' | 'approved' | 'rejected',
    verified: verified ? verified === 'true' : undefined,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    sortBy: sortBy as 'createdAt' | 'rating' | 'helpful',
    sortOrder: sortOrder as 'asc' | 'desc'
  };

  const result = await ProductReviewService.getReviews(filters);

  res.status(200).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  const review = await ProductReviewService.getReviewById(reviewId);

  if (!review) {
    throw OrderErrorHandler.createError(
      'REVIEW_NOT_FOUND',
      'Review not found',
      404
    );
  }

  res.status(200).json({
    success: true,
    message: 'Review retrieved successfully',
    data: review,
  });
});

const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
  if (!userId) {
    userId = req.user?.userId as string | undefined;
  }
  if (!userId && req.user?.email) {
    const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
    if (client?._id) userId = String(client._id);
  }

  if (!userId) {
    throw OrderErrorHandler.createError(
      'UNAUTHORIZED',
      'User authentication required',
      401
    );
  }

  const { reviewId } = req.params;
  const { rating, title, comment, images } = req.body;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  if (rating && (rating < 1 || rating > 5)) {
    throw OrderErrorHandler.createError(
      'INVALID_RATING',
      'Rating must be between 1 and 5',
      400
    );
  }

  const updateData: UpdateReviewData = {
    rating,
    title,
    comment,
    images
  };

  const review = await ProductReviewService.updateReview(reviewId, updateData, userId);

  if (!review) {
    throw OrderErrorHandler.createError(
      'REVIEW_NOT_FOUND',
      'Review not found or you are not authorized to update it',
      404
    );
  }

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  let userId = await decodeBearerTokenAndGetUserId(req.headers.authorization);
  if (!userId) {
    userId = req.user?.userId as string | undefined;
  }
  if (!userId && req.user?.email) {
    const client = await ClientModel.findOne({ email: req.user.email }).select('_id');
    if (client?._id) userId = String(client._id);
  }

  if (!userId) {
    throw OrderErrorHandler.createError(
      'UNAUTHORIZED',
      'User authentication required',
      401
    );
  }

  const { reviewId } = req.params;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  await ProductReviewService.deleteReview(reviewId, userId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

const markHelpful = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { helpful = true } = req.body;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  const review = await ProductReviewService.markHelpful(reviewId, helpful);

  if (!review) {
    throw OrderErrorHandler.createError(
      'REVIEW_NOT_FOUND',
      'Review not found',
      404
    );
  }

  res.status(200).json({
    success: true,
    message: 'Review marked as helpful',
    data: review,
  });
});

const getReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'INVALID_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  const stats = await ProductReviewService.getReviewStats(productId);

  res.status(200).json({
    success: true,
    message: 'Review statistics retrieved successfully',
    data: stats,
  });
});

const getRecentReviews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;

  const reviews = await ProductReviewService.getRecentReviews(parseInt(limit as string));

  res.status(200).json({
    success: true,
    message: 'Recent reviews retrieved successfully',
    data: reviews,
  });
});

const getTopRatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;

  const products = await ProductReviewService.getTopRatedProducts(parseInt(limit as string));

  res.status(200).json({
    success: true,
    message: 'Top rated products retrieved successfully',
    data: products,
  });
});

// Admin routes
const updateReviewStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
    throw OrderErrorHandler.createError(
      'INVALID_STATUS',
      'Status must be pending, approved, or rejected',
      400
    );
  }

  const review = await ProductReviewService.updateReviewStatus(
    reviewId,
    status,
    req.user?.userId || ''
  );

  if (!review) {
    throw OrderErrorHandler.createError(
      'REVIEW_NOT_FOUND',
      'Review not found',
      404
    );
  }

  res.status(200).json({
    success: true,
    message: 'Review status updated successfully',
    data: review,
  });
});

const addAdminResponse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { reviewId } = req.params;
  const { response } = req.body;

  if (!reviewId) {
    throw OrderErrorHandler.createError(
      'INVALID_REVIEW_ID',
      'Review ID is required',
      400
    );
  }

  if (!response) {
    throw OrderErrorHandler.createError(
      'MISSING_RESPONSE',
      'Response text is required',
      400
    );
  }

  const review = await ProductReviewService.addAdminResponse(
    reviewId,
    response,
    req.user?.userId || ''
  );

  if (!review) {
    throw OrderErrorHandler.createError(
      'REVIEW_NOT_FOUND',
      'Review not found',
      404
    );
  }

  res.status(200).json({
    success: true,
    message: 'Admin response added successfully',
    data: review,
  });
});

export const ProductReviewControllers = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markHelpful,
  getReviewStats,
  getRecentReviews,
  getTopRatedProducts,
  updateReviewStatus,
  addAdminResponse,
};
