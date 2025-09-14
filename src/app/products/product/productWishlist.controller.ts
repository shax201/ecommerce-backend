import { Request, Response } from 'express';
import { ProductWishlistService, WishlistFilters } from './productWishlist.service';
import { OrderErrorHandler, asyncHandler } from '../../order/orderErrorHandler';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { decodeBearerTokenAndGetUserId } from '../../../utils/jwt';
import ClientModel from '../../user/client/client.model';

const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { productId, notes, priority = 'medium' } = req.body;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'MISSING_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    throw OrderErrorHandler.createError(
      'INVALID_PRIORITY',
      'Priority must be low, medium, or high',
      400
    );
  }

  const wishlistItem = await ProductWishlistService.addToWishlist(
    userId,
    productId,
    notes,
    priority
  );

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist successfully',
    data: wishlistItem,
  });
});

const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { productId } = req.params;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'MISSING_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  await ProductWishlistService.removeFromWishlist(userId, productId);

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist successfully',
  });
});

const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const {
    priority,
    isActive = 'true',
    page = 1,
    limit = 20,
    sortBy = 'addedAt',
    sortOrder = 'desc'
  } = req.query;

  const filters: WishlistFilters = {
    userId,
    priority: priority as 'low' | 'medium' | 'high',
    isActive: isActive === 'true',
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    sortBy: sortBy as 'addedAt' | 'priority' | 'productTitle',
    sortOrder: sortOrder as 'asc' | 'desc'
  };

  const result = await ProductWishlistService.getWishlist(filters);

  res.status(200).json({
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

const isInWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { productId } = req.params;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'MISSING_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  const isInWishlist = await ProductWishlistService.isInWishlist(userId, productId);

  res.status(200).json({
    success: true,
    message: 'Wishlist status retrieved successfully',
    data: { isInWishlist },
  });
});

const updateWishlistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { productId } = req.params;
  const { notes, priority } = req.body;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'MISSING_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    throw OrderErrorHandler.createError(
      'INVALID_PRIORITY',
      'Priority must be low, medium, or high',
      400
    );
  }

  const wishlistItem = await ProductWishlistService.updateWishlistItem(userId, productId, {
    notes,
    priority
  });

  res.status(200).json({
    success: true,
    message: 'Wishlist item updated successfully',
    data: wishlistItem,
  });
});

const getWishlistStats = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const stats = await ProductWishlistService.getWishlistStats(userId);

  res.status(200).json({
    success: true,
    message: 'Wishlist statistics retrieved successfully',
    data: stats,
  });
});

const getWishlistRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { limit = '10' } = req.query;

  const recommendations = await ProductWishlistService.getWishlistRecommendations(
    userId,
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Wishlist recommendations retrieved successfully',
    data: recommendations,
  });
});

const clearWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const clearedCount = await ProductWishlistService.clearWishlist(userId);

  res.status(200).json({
    success: true,
    message: `Wishlist cleared successfully. ${clearedCount} items removed.`,
    data: { clearedCount },
  });
});

const getWishlistByPriority = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { priority } = req.params;

  if (!priority || !['low', 'medium', 'high'].includes(priority)) {
    throw OrderErrorHandler.createError(
      'INVALID_PRIORITY',
      'Priority must be low, medium, or high',
      400
    );
  }

  const wishlistItems = await ProductWishlistService.getWishlistByPriority(
    userId,
    priority as 'low' | 'medium' | 'high'
  );

  res.status(200).json({
    success: true,
    message: `Wishlist items with ${priority} priority retrieved successfully`,
    data: wishlistItems,
  });
});

const moveToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const { productId } = req.params;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'MISSING_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  await ProductWishlistService.moveToCart(userId, productId);

  res.status(200).json({
    success: true,
    message: 'Product moved to cart successfully',
  });
});

export const ProductWishlistControllers = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  updateWishlistItem,
  getWishlistStats,
  getWishlistRecommendations,
  clearWishlist,
  getWishlistByPriority,
  moveToCart,
};
