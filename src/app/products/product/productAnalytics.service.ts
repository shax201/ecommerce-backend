import mongoose from 'mongoose';
import { ProductModel } from './product.model';
import OrderHistoryModel from '../../order/orderHistory/orderHistory.model';

export interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalRevenue: number;
  averageProductValue: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
    views: number;
    conversionRate: number;
  }>;
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalRevenue: number;
    averageRating: number;
  }>;
  inventoryValue: number;
  stockTurnover: number;
  priceDistribution: {
    under50: number;
    between50and100: number;
    between100and200: number;
    over200: number;
  };
  recentActivity: Array<{
    productId: string;
    productName: string;
    action: string;
    timestamp: Date;
  }>;
}

export interface ProductPerformanceMetrics {
  productId: string;
  productName: string;
  views: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number;
  wishlistCount: number;
  stockStatus: string;
  lastViewed?: Date;
  lastPurchased?: Date;
}

export interface InventoryReport {
  totalValue: number;
  lowStockItems: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
    value: number;
  }>;
  outOfStockItems: Array<{
    productId: string;
    productName: string;
    lastSold?: Date;
    value: number;
  }>;
  overstockItems: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    value: number;
  }>;
  stockTurnoverRate: number;
}

export class ProductAnalyticsService {
  /**
   * Get comprehensive product analytics
   */
  static async getProductAnalytics(dateRange?: { startDate: Date; endDate: Date }): Promise<ProductAnalytics> {
    const matchStage = dateRange ? {
      createdAt: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    } : {};

    const pipeline = [
      {
        $lookup: {
          from: 'orderhistories',
          localField: '_id',
          foreignField: 'productID',
          as: 'orders'
        }
      },
      {
        $lookup: {
          from: 'catagories',
          localField: 'catagory',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $addFields: {
          totalRevenue: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $multiply: ['$$order.totalPrice', { $size: '$$order.productID' }]
                }
              }
            }
          },
          totalSales: { $size: '$orders' },
          isLowStock: {
            $and: [
              { $eq: ['$inventory.trackInventory', true] },
              { $lte: ['$inventory.availableStock', '$inventory.lowStockThreshold'] }
          ]
          },
          isOutOfStock: {
            $and: [
              { $eq: ['$inventory.trackInventory', true] },
              { $eq: ['$inventory.availableStock', 0] }
          ]
          },
          inventoryValue: {
            $multiply: ['$inventory.availableStock', '$discountPrice']
          }
        }
      },
      {
        $facet: {
          // Basic metrics
          basicMetrics: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                activeProducts: {
                  $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                lowStockProducts: {
                  $sum: { $cond: ['$isLowStock', 1, 0] }
                },
                outOfStockProducts: {
                  $sum: { $cond: ['$isOutOfStock', 1, 0] }
                },
                totalRevenue: { $sum: '$totalRevenue' },
                averageProductValue: { $avg: '$discountPrice' },
                inventoryValue: { $sum: '$inventoryValue' }
              }
            }
          ],
          // Top selling products
          topSellingProducts: [
            {
              $match: { totalSales: { $gt: 0 } }
            },
            {
              $project: {
                productId: '$_id',
                productName: '$title',
                sales: '$totalSales',
                revenue: '$totalRevenue',
                views: '$analytics.views',
                conversionRate: {
                  $cond: [
                    { $gt: ['$analytics.views', 0] },
                    { $multiply: [{ $divide: ['$totalSales', '$analytics.views'] }, 100] },
                    0
                  ]
                }
              }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 }
          ],
          // Category performance
          categoryPerformance: [
            { $unwind: '$categories' },
            {
              $group: {
                _id: '$categories._id',
                categoryName: { $first: '$categories.title' },
                productCount: { $sum: 1 },
                totalRevenue: { $sum: '$totalRevenue' },
                averageRating: { $avg: '$analytics.averageRating' }
              }
            },
            { $sort: { totalRevenue: -1 } }
          ],
          // Price distribution
          priceDistribution: [
            {
              $group: {
                _id: null,
                under50: {
                  $sum: { $cond: [{ $lt: ['$discountPrice', 50] }, 1, 0] }
                },
                between50and100: {
                  $sum: { 
                    $cond: [
                      { $and: [
                        { $gte: ['$discountPrice', 50] },
                        { $lt: ['$discountPrice', 100] }
                      ]}, 
                      1, 
                      0
                    ]
                  }
                },
                between100and200: {
                  $sum: { 
                    $cond: [
                      { $and: [
                        { $gte: ['$discountPrice', 100] },
                        { $lt: ['$discountPrice', 200] }
                      ]}, 
                      1, 
                      0
                    ]
                  }
                },
                over200: {
                  $sum: { $cond: [{ $gte: ['$discountPrice', 200] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ];

    const [result] = await ProductModel.aggregate(pipeline);
    
    const basicMetrics = result.basicMetrics[0] || {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalRevenue: 0,
      averageProductValue: 0,
      inventoryValue: 0
    };

    const topSellingProducts = result.topSellingProducts || [];
    const categoryPerformance = result.categoryPerformance || [];
    const priceDistribution = result.priceDistribution[0] || {
      under50: 0,
      between50and100: 0,
      between100and200: 0,
      over200: 0
    };

    // Calculate stock turnover rate
    const stockTurnover = basicMetrics.inventoryValue > 0 
      ? basicMetrics.totalRevenue / basicMetrics.inventoryValue 
      : 0;

    return {
      totalProducts: basicMetrics.totalProducts,
      activeProducts: basicMetrics.activeProducts,
      lowStockProducts: basicMetrics.lowStockProducts,
      outOfStockProducts: basicMetrics.outOfStockProducts,
      totalRevenue: basicMetrics.totalRevenue,
      averageProductValue: Math.round(basicMetrics.averageProductValue * 100) / 100,
      topSellingProducts,
      categoryPerformance,
      inventoryValue: basicMetrics.inventoryValue,
      stockTurnover: Math.round(stockTurnover * 100) / 100,
      priceDistribution,
      recentActivity: [] // This would need to be implemented with activity tracking
    };
  }

  /**
   * Get product performance metrics
   */
  static async getProductPerformanceMetrics(
    productId?: string,
    limit: number = 50
  ): Promise<ProductPerformanceMetrics[]> {
    const matchStage = productId ? { _id: new mongoose.Types.ObjectId(productId) } : {};

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'orderhistories',
          localField: '_id',
          foreignField: 'productID',
          as: 'orders'
        }
      },
      {
        $addFields: {
          purchases: { $size: '$orders' },
          revenue: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $multiply: ['$$order.totalPrice', { $size: '$$order.productID' }]
                }
              }
            }
          },
          conversionRate: {
            $cond: [
              { $gt: ['$analytics.views', 0] },
              { $multiply: [{ $divide: [{ $size: '$orders' }, '$analytics.views'] }, 100] },
              0
            ]
          },
          stockStatus: {
            $cond: [
              { $eq: ['$inventory.trackInventory', false] },
              'unlimited',
              {
                $cond: [
                  { $eq: ['$inventory.availableStock', 0] },
                  'out_of_stock',
                  {
                    $cond: [
                      { $lte: ['$inventory.availableStock', '$inventory.lowStockThreshold'] },
                      'low_stock',
                      'in_stock'
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $project: {
          productId: '$_id',
          productName: '$title',
          views: '$analytics.views',
          purchases: '$purchases',
          revenue: '$revenue',
          conversionRate: { $round: ['$conversionRate', 2] },
          averageRating: '$analytics.averageRating',
          totalReviews: '$analytics.totalReviews',
          wishlistCount: '$analytics.wishlistCount',
          stockStatus: '$stockStatus',
          lastViewed: '$analytics.lastViewed',
          lastPurchased: '$analytics.lastPurchased'
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ];

    return await ProductModel.aggregate(pipeline);
  }

  /**
   * Get inventory report
   */
  static async getInventoryReport(): Promise<InventoryReport> {
    const pipeline = [
      {
        $addFields: {
          inventoryValue: {
            $multiply: ['$inventory.availableStock', '$discountPrice']
          },
          isLowStock: {
            $and: [
              { $eq: ['$inventory.trackInventory', true] },
              { $lte: ['$inventory.availableStock', '$inventory.lowStockThreshold'] },
              { $gt: ['$inventory.availableStock', 0] }
            ]
          },
          isOutOfStock: {
            $and: [
              { $eq: ['$inventory.trackInventory', true] },
              { $eq: ['$inventory.availableStock', 0] }
            ]
          },
          isOverstock: {
            $and: [
              { $eq: ['$inventory.trackInventory', true] },
              { $gt: ['$inventory.availableStock', { $multiply: ['$inventory.lowStockThreshold', 5] }] }
            ]
          }
        }
      },
      {
        $facet: {
          totalValue: [
            {
              $group: {
                _id: null,
                value: { $sum: '$inventoryValue' }
              }
            }
          ],
          lowStockItems: [
            { $match: { isLowStock: true } },
            {
              $project: {
                productId: '$_id',
                productName: '$title',
                currentStock: '$inventory.availableStock',
                threshold: '$inventory.lowStockThreshold',
                value: '$inventoryValue'
              }
            }
          ],
          outOfStockItems: [
            { $match: { isOutOfStock: true } },
            {
              $lookup: {
                from: 'orderhistories',
                localField: '_id',
                foreignField: 'productID',
                as: 'lastOrder'
              }
            },
            {
              $addFields: {
                lastSold: {
                  $max: {
                    $map: {
                      input: '$lastOrder',
                      as: 'order',
                      in: '$$order.createdAt'
                    }
                  }
                }
              }
            },
            {
              $project: {
                productId: '$_id',
                productName: '$title',
                lastSold: '$lastSold',
                value: '$inventoryValue'
              }
            }
          ],
          overstockItems: [
            { $match: { isOverstock: true } },
            {
              $project: {
                productId: '$_id',
                productName: '$title',
                currentStock: '$inventory.availableStock',
                value: '$inventoryValue'
              }
            }
          ]
        }
      }
    ];

    const [result] = await ProductModel.aggregate(pipeline);
    
    const totalValue = result.totalValue[0]?.value || 0;
    const lowStockItems = result.lowStockItems || [];
    const outOfStockItems = result.outOfStockItems || [];
    const overstockItems = result.overstockItems || [];

    // Calculate stock turnover rate
    const totalInventoryValue = totalValue;
    const totalRevenue = await this.getTotalRevenue();
    const stockTurnoverRate = totalInventoryValue > 0 ? totalRevenue / totalInventoryValue : 0;

    return {
      totalValue,
      lowStockItems,
      outOfStockItems,
      overstockItems,
      stockTurnoverRate: Math.round(stockTurnoverRate * 100) / 100
    };
  }

  /**
   * Track product view
   */
  static async trackProductView(productId: string): Promise<void> {
    await ProductModel.findByIdAndUpdate(
      productId,
      {
        $inc: { 'analytics.views': 1 },
        $set: { 'analytics.lastViewed': new Date() }
      }
    );
  }

  /**
   * Track product purchase
   */
  static async trackProductPurchase(productId: string, quantity: number = 1): Promise<void> {
    await ProductModel.findByIdAndUpdate(
      productId,
      {
        $inc: { 
          'analytics.purchases': quantity,
          'inventory.totalStock': -quantity
        },
        $set: { 'analytics.lastPurchased': new Date() }
      }
    );
  }

  /**
   * Update product rating
   */
  static async updateProductRating(productId: string, rating: number): Promise<void> {
    const product = await ProductModel.findById(productId);
    if (!product) return;

    const currentRating = product.analytics?.averageRating || 0;
    const currentReviews = product.analytics?.totalReviews || 0;
    
    const newTotalReviews = currentReviews + 1;
    const newAverageRating = ((currentRating * currentReviews) + rating) / newTotalReviews;

    await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          'analytics.averageRating': Math.round(newAverageRating * 100) / 100,
          'analytics.totalReviews': newTotalReviews
        }
      }
    );
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId: string, limit: number = 5): Promise<any[]> {
    const product = await ProductModel.findById(productId);
    if (!product) return [];

    const pipeline = [
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(productId) },
          status: 'active',
          $or: [
            { catagory: { $in: product.catagory } },
            { tags: { $in: product.tags || [] } }
          ]
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $size: { $setIntersection: ['$catagory', product.catagory] } },
              { $size: { $setIntersection: ['$tags', product.tags || []] } }
            ]
          }
        }
      },
      { $sort: { relevanceScore: -1, 'analytics.views': -1 } },
      { $limit: limit },
      {
        $project: {
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

  private static async getTotalRevenue(): Promise<number> {
    const result = await OrderHistoryModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    return result[0]?.totalRevenue || 0;
  }
}
