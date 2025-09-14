import { Request, Response } from 'express';
import { OrderAnalyticsService } from './orderAnalytics.service';
import { OrderErrorHandler, asyncHandler } from './orderErrorHandler';

const getOrderAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string)
    };
  }

  const analytics = await OrderAnalyticsService.getOrderAnalytics(dateRange);

  res.status(200).json({
    success: true,
    message: 'Order analytics retrieved successfully',
    data: analytics,
  });
});

const getSalesTrends = asyncHandler(async (req: Request, res: Response) => {
  const { period = 'monthly', startDate, endDate } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string)
    };
  }

  const trends = await OrderAnalyticsService.getSalesTrends(
    period as 'daily' | 'weekly' | 'monthly',
    dateRange
  );

  res.status(200).json({
    success: true,
    message: 'Sales trends retrieved successfully',
    data: trends,
  });
});

const getCustomerAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const analytics = await OrderAnalyticsService.getCustomerAnalytics();

  res.status(200).json({
    success: true,
    message: 'Customer analytics retrieved successfully',
    data: analytics,
  });
});

const getProductAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const analytics = await OrderAnalyticsService.getProductAnalytics();

  res.status(200).json({
    success: true,
    message: 'Product analytics retrieved successfully',
    data: analytics,
  });
});

const getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, groupBy = 'monthly' } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string)
    };
  }

  const [analytics, trends] = await Promise.all([
    OrderAnalyticsService.getOrderAnalytics(dateRange),
    OrderAnalyticsService.getSalesTrends(
      groupBy as 'daily' | 'weekly' | 'monthly',
      dateRange
    )
  ]);

  const report = {
    summary: {
      totalRevenue: analytics.totalRevenue,
      totalOrders: analytics.totalOrders,
      averageOrderValue: analytics.averageOrderValue,
      period: dateRange ? `${startDate} to ${endDate}` : 'All time'
    },
    trends,
    breakdown: {
      ordersByStatus: analytics.ordersByStatus,
      paymentMethods: analytics.paymentMethodDistribution,
      deliveryPerformance: analytics.deliveryPerformance
    }
  };

  res.status(200).json({
    success: true,
    message: 'Revenue report generated successfully',
    data: report,
  });
});

const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string)
    };
  }

  const [orderAnalytics, customerAnalytics, productAnalytics, salesTrends] = await Promise.all([
    OrderAnalyticsService.getOrderAnalytics(dateRange),
    OrderAnalyticsService.getCustomerAnalytics(),
    OrderAnalyticsService.getProductAnalytics(),
    OrderAnalyticsService.getSalesTrends('monthly', dateRange)
  ]);

  const dashboard = {
    overview: {
      totalOrders: orderAnalytics.totalOrders,
      totalRevenue: orderAnalytics.totalRevenue,
      averageOrderValue: orderAnalytics.averageOrderValue,
      totalCustomers: customerAnalytics.totalCustomers,
      activeCustomers: customerAnalytics.activeCustomers
    },
    trends: salesTrends,
    topProducts: productAnalytics.topSellingProducts.slice(0, 5),
    orderStatus: orderAnalytics.ordersByStatus,
    recentActivity: {
      newCustomers: customerAnalytics.newCustomersThisMonth,
      deliveryPerformance: orderAnalytics.deliveryPerformance
    }
  };

  res.status(200).json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: dashboard,
  });
});

export const OrderAnalyticsControllers = {
  getOrderAnalytics,
  getSalesTrends,
  getCustomerAnalytics,
  getProductAnalytics,
  getRevenueReport,
  getDashboardData,
};
