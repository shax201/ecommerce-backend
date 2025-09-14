import { Request, Response } from 'express';
import { ProductAnalyticsService } from './productAnalytics.service';
import { OrderErrorHandler, asyncHandler } from '../../order/orderErrorHandler';

const getProductAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string)
    };
  }

  const analytics = await ProductAnalyticsService.getProductAnalytics(dateRange);

  res.status(200).json({
    success: true,
    message: 'Product analytics retrieved successfully',
    data: analytics,
  });
});

const getProductPerformanceMetrics = asyncHandler(async (req: Request, res: Response) => {
  const { productId, limit = '50' } = req.query;

  const metrics = await ProductAnalyticsService.getProductPerformanceMetrics(
    productId as string,
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Product performance metrics retrieved successfully',
    data: metrics,
  });
});

const getInventoryReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ProductAnalyticsService.getInventoryReport();

  res.status(200).json({
    success: true,
    message: 'Inventory report generated successfully',
    data: report,
  });
});

const trackProductView = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'INVALID_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  await ProductAnalyticsService.trackProductView(productId);

  res.status(200).json({
    success: true,
    message: 'Product view tracked successfully',
  });
});

const trackProductPurchase = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'INVALID_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  if (quantity < 1) {
    throw OrderErrorHandler.createError(
      'INVALID_QUANTITY',
      'Quantity must be at least 1',
      400
    );
  }

  await ProductAnalyticsService.trackProductPurchase(productId, quantity);

  res.status(200).json({
    success: true,
    message: 'Product purchase tracked successfully',
  });
});

const updateProductRating = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { rating } = req.body;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'INVALID_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  if (!rating || rating < 1 || rating > 5) {
    throw OrderErrorHandler.createError(
      'INVALID_RATING',
      'Rating must be between 1 and 5',
      400
    );
  }

  await ProductAnalyticsService.updateProductRating(productId, rating);

  res.status(200).json({
    success: true,
    message: 'Product rating updated successfully',
  });
});

const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { limit = '5' } = req.query;

  if (!productId) {
    throw OrderErrorHandler.createError(
      'INVALID_PRODUCT_ID',
      'Product ID is required',
      400
    );
  }

  const relatedProducts = await ProductAnalyticsService.getRelatedProducts(
    productId,
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Related products retrieved successfully',
    data: relatedProducts,
  });
});

const getProductRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const { userId, limit = '10' } = req.query;

  // This would typically use user's purchase history and preferences
  // For now, we'll return top-rated products
  const recommendations = await ProductAnalyticsService.getProductPerformanceMetrics(
    undefined,
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Product recommendations retrieved successfully',
    data: recommendations,
  });
});

const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '20' } = req.query;

  const inventoryReport = await ProductAnalyticsService.getInventoryReport();
  
  const lowStockProducts = inventoryReport.lowStockItems.slice(0, parseInt(limit as string));

  res.status(200).json({
    success: true,
    message: 'Low stock products retrieved successfully',
    data: {
      products: lowStockProducts,
      total: inventoryReport.lowStockItems.length
    },
  });
});

const getTopSellingProducts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10', period = 'all' } = req.query;

  let dateRange;
  if (period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateRange = { startDate: weekAgo, endDate: new Date() };
  } else if (period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateRange = { startDate: monthAgo, endDate: new Date() };
  }

  const analytics = await ProductAnalyticsService.getProductAnalytics(dateRange);
  const topSelling = analytics.topSellingProducts.slice(0, parseInt(limit as string));

  res.status(200).json({
    success: true,
    message: 'Top selling products retrieved successfully',
    data: topSelling,
  });
});

export const ProductAnalyticsControllers = {
  getProductAnalytics,
  getProductPerformanceMetrics,
  getInventoryReport,
  trackProductView,
  trackProductPurchase,
  updateProductRating,
  getRelatedProducts,
  getProductRecommendations,
  getLowStockProducts,
  getTopSellingProducts,
};
