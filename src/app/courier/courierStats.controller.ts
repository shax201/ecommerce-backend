import { Request, Response } from 'express';
import { CourierCredentialsService } from './courierCredentials.service';
import { OrderAnalyticsService } from '../order/orderAnalytics.service';
import { CourierService } from './CourierService';
import { CourierOrdersService } from './courierOrders.service';

const courierCredentialsService = new CourierCredentialsService();
const courierService = new CourierService();

export class CourierStatsController {
  /**
   * Get comprehensive courier statistics
   */
  async getCourierStats(req: Request, res: Response): Promise<void> {
    try {
      // Get active couriers
      const activeCouriers = await courierCredentialsService.getActiveCouriers();
      
      // Get all courier credentials for validation
      const allCredentials = await courierCredentialsService.getAllCredentials();
      
      // Get order analytics for courier-related stats
      const orderAnalytics = await OrderAnalyticsService.getOrderAnalytics();
      
      // Calculate courier-specific metrics
      const courierStats = await this.calculateCourierMetrics(activeCouriers, orderAnalytics);
      
      res.status(200).json({
        success: true,
        data: courierStats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courier statistics',
        error: error.message
      });
    }
  }

  /**
   * Get courier performance metrics
   */
  async getCourierPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { courier } = req.params;
      
      if (!['pathao', 'steadfast'].includes(courier)) {
        res.status(400).json({
          success: false,
          message: 'Invalid courier type. Must be pathao or steadfast'
        });
        return;
      }

      // Validate courier credentials
      const isValid = await courierService.validateCourierCredentials(courier as 'pathao' | 'steadfast');
      
      // Get courier-specific performance data
      const performance = await this.getCourierSpecificPerformance(courier as 'pathao' | 'steadfast');
      
      res.status(200).json({
        success: true,
        data: {
          courier,
          isValid,
          performance
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courier performance',
        error: error.message
      });
    }
  }

  /**
   * Calculate comprehensive courier metrics
   */
  private async calculateCourierMetrics(activeCouriers: string[], orderAnalytics: any) {
    // Calculate active couriers count
    const activeCouriersCount = activeCouriers.length;
    
    // Calculate total orders (using order analytics)
    const totalOrders = orderAnalytics.totalOrders || 0;
    
    // Calculate pending orders (orders that are not delivered or cancelled)
    const pendingOrders = (orderAnalytics.ordersByStatus?.pending || 0) + 
                         (orderAnalytics.ordersByStatus?.processing || 0) + 
                         (orderAnalytics.ordersByStatus?.shipped || 0);
    
    // Calculate success rate (delivered orders / total orders)
    const deliveredOrders = orderAnalytics.ordersByStatus?.delivered || 0;
    const cancelledOrders = orderAnalytics.ordersByStatus?.cancelled || 0;
    const processedOrders = totalOrders - cancelledOrders;
    const successRate = processedOrders > 0 ? (deliveredOrders / processedOrders) * 100 : 0;
    
    // Calculate growth metrics (mock data for now - would need historical data)
    const lastMonthOrders = Math.floor(totalOrders * 0.8); // Mock: 20% growth
    const orderGrowth = totalOrders > 0 ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;
    
    const lastWeekPending = Math.floor(pendingOrders * 1.12); // Mock: 12% decrease
    const pendingGrowth = pendingOrders > 0 ? ((pendingOrders - lastWeekPending) / lastWeekPending) * 100 : 0;
    
    const lastMonthSuccessRate = Math.max(0, successRate - 0.3); // Mock: 0.3% improvement
    const successRateGrowth = successRate > 0 ? ((successRate - lastMonthSuccessRate) / lastMonthSuccessRate) * 100 : 0;

    return {
      activeCouriers: {
        count: activeCouriersCount,
        list: activeCouriers,
        description: activeCouriers.join(', ') || 'No active couriers'
      },
      totalOrders: {
        count: totalOrders,
        growth: Math.round(orderGrowth * 10) / 10,
        description: orderGrowth >= 0 ? `+${Math.round(orderGrowth * 10) / 10}% from last month` : `${Math.round(orderGrowth * 10) / 10}% from last month`
      },
      pendingOrders: {
        count: pendingOrders,
        growth: Math.round(pendingGrowth * 10) / 10,
        description: pendingGrowth <= 0 ? `${Math.round(pendingGrowth * 10) / 10}% from last week` : `+${Math.round(pendingGrowth * 10) / 10}% from last week`
      },
      successRate: {
        percentage: Math.round(successRate * 10) / 10,
        growth: Math.round(successRateGrowth * 10) / 10,
        description: successRateGrowth >= 0 ? `+${Math.round(successRateGrowth * 10) / 10}% from last month` : `${Math.round(successRateGrowth * 10) / 10}% from last month`
      },
      additionalMetrics: {
        deliveredOrders,
        cancelledOrders,
        averageOrderValue: orderAnalytics.averageOrderValue || 0,
        totalRevenue: orderAnalytics.totalRevenue || 0
      }
    };
  }

  /**
   * Get courier-specific performance data
   */
  private async getCourierSpecificPerformance(courier: 'pathao' | 'steadfast') {
    // This would typically query courier-specific data from the database
    // For now, return mock data based on courier type
    const mockData = {
      pathao: {
        totalOrders: 850,
        successRate: 98.2,
        averageDeliveryTime: 1.5, // days
        lastOrderDate: new Date().toISOString(),
        isOnline: true
      },
      steadfast: {
        totalOrders: 384,
        successRate: 97.8,
        averageDeliveryTime: 2.1, // days
        lastOrderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isOnline: true
      }
    };

      return mockData[courier] || {
      totalOrders: 0,
      successRate: 0,
      averageDeliveryTime: 0,
      lastOrderDate: null,
      isOnline: false
    };
  }

  /**
   * Test endpoint to seed courier orders
   */
  async seedTestCourierOrders(req: Request, res: Response): Promise<void> {
    try {
      // Import and run the seed function
      const { seedCourierOrders } = await import('./seedCourierOrders');
      await seedCourierOrders();
      
      res.status(200).json({
        success: true,
        message: 'Test courier orders seeded successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to seed test courier orders',
        error: error.message
      });
    }
  }
}
