import mongoose from 'mongoose';
import OrderHistoryModel from './orderHistory/orderHistory.model';

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByMonth: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  customerMetrics: {
    totalCustomers: number;
    repeatCustomers: number;
    newCustomers: number;
  };
  paymentMethodDistribution: Record<string, number>;
  deliveryPerformance: {
    onTimeDeliveries: number;
    lateDeliveries: number;
    averageDeliveryTime: number;
  };
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class OrderAnalyticsService {
  /**
   * Get comprehensive order analytics
   */
  static async getOrderAnalytics(dateRange?: DateRange): Promise<OrderAnalytics> {
    const matchStage = dateRange ? {
      createdAt: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    } : {};

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'productID',
          foreignField: '_id',
          as: 'products'
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientID',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: { path: '$client', preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          year: { $year: '$createdAt' },
          productCount: { $size: '$products' }
        }
      },
      {
        $facet: {
          // Basic metrics
          basicMetrics: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalPrice' },
                averageOrderValue: { $avg: '$totalPrice' }
              }
            }
          ],
          // Orders by status
          statusMetrics: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          // Monthly trends
          monthlyTrends: [
            {
              $group: {
                _id: '$month',
                orders: { $sum: 1 },
                revenue: { $sum: '$totalPrice' }
              }
            },
            { $sort: { _id: 1 } }
          ],
          // Product performance
          productPerformance: [
            { $unwind: '$products' },
            {
              $group: {
                _id: '$products._id',
                productName: { $first: '$products.title' },
                quantity: { $sum: 1 },
                revenue: { $sum: '$totalPrice' }
              }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 }
          ],
          // Customer metrics
          customerMetrics: [
            {
              $group: {
                _id: '$clientID',
                orderCount: { $sum: 1 },
                firstOrder: { $min: '$createdAt' },
                lastOrder: { $max: '$createdAt' }
              }
            },
            {
              $group: {
                _id: null,
                totalCustomers: { $sum: 1 },
                repeatCustomers: {
                  $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
                },
                newCustomers: {
                  $sum: { $cond: [{ $eq: ['$orderCount', 1] }, 1, 0] }
                }
              }
            }
          ],
          // Payment method distribution
          paymentMethods: [
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 }
              }
            }
          ],
          // Delivery performance
          deliveryPerformance: [
            {
              $match: {
                status: 'delivered',
                estimatedDeliveryDate: { $exists: true }
              }
            },
            {
              $addFields: {
                deliveryTime: {
                  $divide: [
                    { $subtract: ['$updatedAt', '$createdAt'] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                },
                isOnTime: {
                  $cond: [
                    { $lte: ['$updatedAt', '$estimatedDeliveryDate'] },
                    1,
                    0
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                onTimeDeliveries: { $sum: '$isOnTime' },
                totalDeliveries: { $sum: 1 },
                averageDeliveryTime: { $avg: '$deliveryTime' }
              }
            }
          ]
        }
      }
    ];

    const [result] = await OrderHistoryModel.aggregate(pipeline);
    
    const basicMetrics = result.basicMetrics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };

    const ordersByStatus = result.statusMetrics.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const ordersByMonth = result.monthlyTrends.map((item: any) => ({
      month: item._id,
      orders: item.orders,
      revenue: item.revenue
    }));

    const topProducts = result.productPerformance.map((item: any) => ({
      productId: item._id.toString(),
      productName: item.productName,
      quantity: item.quantity,
      revenue: item.revenue
    }));

    const customerMetrics = result.customerMetrics[0] || {
      totalCustomers: 0,
      repeatCustomers: 0,
      newCustomers: 0
    };

    const paymentMethodDistribution = result.paymentMethods.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const deliveryPerf = result.deliveryPerformance[0] || {
      onTimeDeliveries: 0,
      totalDeliveries: 0,
      averageDeliveryTime: 0
    };

    return {
      totalOrders: basicMetrics.totalOrders,
      totalRevenue: basicMetrics.totalRevenue,
      averageOrderValue: Math.round(basicMetrics.averageOrderValue * 100) / 100,
      ordersByStatus,
      ordersByMonth,
      topProducts,
      customerMetrics,
      paymentMethodDistribution,
      deliveryPerformance: {
        onTimeDeliveries: deliveryPerf.onTimeDeliveries,
        lateDeliveries: deliveryPerf.totalDeliveries - deliveryPerf.onTimeDeliveries,
        averageDeliveryTime: Math.round(deliveryPerf.averageDeliveryTime * 100) / 100
      }
    };
  }

  /**
   * Get sales trends for a specific period
   */
  static async getSalesTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    dateRange?: DateRange
  ): Promise<Array<{ period: string; orders: number; revenue: number }>> {
    const matchStage = dateRange ? {
      createdAt: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    } : {};

    let dateFormat = '%Y-%m';
    if (period === 'daily') dateFormat = '%Y-%m-%d';
    if (period === 'weekly') dateFormat = '%Y-W%U';

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const result = await OrderHistoryModel.aggregate(pipeline);
    
    return result.map(item => ({
      period: item._id,
      orders: item.orders,
      revenue: item.revenue
    }));
  }

  /**
   * Get customer analytics
   */
  static async getCustomerAnalytics(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    customerLifetimeValue: number;
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      totalOrders: number;
      totalSpent: number;
    }>;
  }> {
    const pipeline = [
      {
        $lookup: {
          from: 'clients',
          localField: 'clientID',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $group: {
          _id: '$clientID',
          customerName: { $first: { $concat: ['$client.firstName', ' ', '$client.lastName'] } },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $facet: {
          customerStats: [
            {
              $group: {
                _id: null,
                totalCustomers: { $sum: 1 },
                activeCustomers: {
                  $sum: {
                    $cond: [
                      { $gte: [{ $subtract: [new Date(), '$lastOrder'] }, 30 * 24 * 60 * 60 * 1000] },
                      0,
                      1
                    ]
                  }
                },
                newCustomersThisMonth: {
                  $sum: {
                    $cond: [
                      { $gte: ['$firstOrder', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                      1,
                      0
                    ]
                  }
                },
                averageLifetimeValue: { $avg: '$totalSpent' }
              }
            }
          ],
          topCustomers: [
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ];

    const [result] = await OrderHistoryModel.aggregate(pipeline);
    
    const stats = result.customerStats[0] || {
      totalCustomers: 0,
      activeCustomers: 0,
      newCustomersThisMonth: 0,
      averageLifetimeValue: 0
    };

    const topCustomers = result.topCustomers.map((customer: any) => ({
      customerId: customer._id.toString(),
      customerName: customer.customerName,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent
    }));

    return {
      totalCustomers: stats.totalCustomers,
      activeCustomers: stats.activeCustomers,
      newCustomersThisMonth: stats.newCustomersThisMonth,
      customerLifetimeValue: Math.round(stats.averageLifetimeValue * 100) / 100,
      topCustomers
    };
  }

  /**
   * Get product performance analytics
   */
  static async getProductAnalytics(): Promise<{
    totalProducts: number;
    topSellingProducts: Array<{
      productId: string;
      productName: string;
      orders: number;
      revenue: number;
      averageOrderValue: number;
    }>;
    lowStockProducts: Array<{
      productId: string;
      productName: string;
      stockLevel: number;
    }>;
  }> {
    const pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'productID',
          foreignField: '_id',
          as: 'products'
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products._id',
          productName: { $first: '$products.title' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      },
      {
        $facet: {
          productStats: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 }
              }
            }
          ],
          topProducts: [
            { $sort: { orders: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ];

    const [result] = await OrderHistoryModel.aggregate(pipeline);
    
    const stats = result.productStats[0] || { totalProducts: 0 };
    
    const topSellingProducts = result.topProducts.map((product: any) => ({
      productId: product._id.toString(),
      productName: product.productName,
      orders: product.orders,
      revenue: product.revenue,
      averageOrderValue: Math.round(product.averageOrderValue * 100) / 100
    }));

    return {
      totalProducts: stats.totalProducts,
      topSellingProducts,
      lowStockProducts: [] // This would need to be implemented with actual stock data
    };
  }
}
