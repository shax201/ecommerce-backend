import mongoose from 'mongoose';
import OrderHistoryModel from '../order/orderHistory/orderHistory.model';
import { CourierOrdersService } from './courierOrders.service';

// Mock courier orders data
const mockCourierOrders = [
  {
    orderNumber: 'ORD-2024-001',
    courierBooking: 'pathao',
    consignmentId: 'PA-123456789',
    trackingNumber: 'TRK-PA-001',
    status: 'delivered',
    courierStatus: 'delivered',
    courierDeliveryFee: 80,
    courierEstimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalPrice: 1500,
    notes: 'Handle with care',
    courierTrackingSteps: [
      { status: 'pending', timestamp: new Date(), location: 'Warehouse', note: 'Order received' },
      { status: 'picked_up', timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000), location: 'Warehouse', note: 'Picked up by courier' },
      { status: 'in_transit', timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000), location: 'Distribution Center', note: 'In transit' },
      { status: 'delivered', timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000), location: 'Customer Address', note: 'Delivered successfully' }
    ],
    trackingSteps: ['pending', 'picked_up', 'in_transit', 'delivered']
  },
  {
    orderNumber: 'ORD-2024-002',
    courierBooking: 'steadfast',
    consignmentId: 'SF-987654321',
    trackingNumber: 'TRK-SF-002',
    status: 'shipped',
    courierStatus: 'in_transit',
    courierDeliveryFee: 120,
    courierEstimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    totalPrice: 2200,
    notes: 'Fragile items',
    courierTrackingSteps: [
      { status: 'pending', timestamp: new Date(), location: 'Warehouse', note: 'Order received' },
      { status: 'picked_up', timestamp: new Date(Date.now() + 1 * 60 * 60 * 1000), location: 'Warehouse', note: 'Picked up by courier' },
      { status: 'in_transit', timestamp: new Date(Date.now() + 3 * 60 * 60 * 1000), location: 'Distribution Center', note: 'In transit' }
    ],
    trackingSteps: ['pending', 'picked_up', 'in_transit']
  },
  {
    orderNumber: 'ORD-2024-003',
    courierBooking: 'pathao',
    consignmentId: 'PA-456789123',
    trackingNumber: 'TRK-PA-003',
    status: 'processing',
    courierStatus: 'pending',
    courierDeliveryFee: 60,
    courierEstimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    totalPrice: 800,
    notes: 'Express delivery',
    courierTrackingSteps: [
      { status: 'pending', timestamp: new Date(), location: 'Warehouse', note: 'Order received' }
    ],
    trackingSteps: ['pending']
  },
  {
    orderNumber: 'ORD-2024-004',
    courierBooking: 'steadfast',
    consignmentId: 'SF-654321987',
    trackingNumber: 'TRK-SF-004',
    status: 'cancelled',
    courierStatus: 'cancelled',
    courierDeliveryFee: 0,
    totalPrice: 3000,
    notes: 'Customer cancelled',
    courierTrackingSteps: [
      { status: 'pending', timestamp: new Date(), location: 'Warehouse', note: 'Order received' },
      { status: 'cancelled', timestamp: new Date(Date.now() + 30 * 60 * 1000), location: 'Warehouse', note: 'Order cancelled by customer' }
    ],
    trackingSteps: ['pending', 'cancelled']
  },
  {
    orderNumber: 'ORD-2024-005',
    courierBooking: 'pathao',
    consignmentId: 'PA-789123456',
    trackingNumber: 'TRK-PA-005',
    status: 'delivered',
    courierStatus: 'delivered',
    courierDeliveryFee: 100,
    courierEstimatedDelivery: new Date(Date.now() - 24 * 60 * 60 * 1000),
    totalPrice: 1800,
    notes: 'Standard delivery',
    courierTrackingSteps: [
      { status: 'pending', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), location: 'Warehouse', note: 'Order received' },
      { status: 'picked_up', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), location: 'Warehouse', note: 'Picked up by courier' },
      { status: 'in_transit', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), location: 'Distribution Center', note: 'In transit' },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), location: 'Local Hub', note: 'Out for delivery' },
      { status: 'delivered', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), location: 'Customer Address', note: 'Delivered successfully' }
    ],
    trackingSteps: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
  }
];

export async function seedCourierOrders() {
  try {
    console.log('🌱 Seeding courier orders...');

    // Check if courier orders already exist
    const existingOrders = await OrderHistoryModel.countDocuments({
      courierBooking: { $exists: true, $ne: null }
    });

    if (existingOrders > 0) {
      console.log(`✅ ${existingOrders} courier orders already exist. Skipping seed.`);
      return;
    }

    // Create mock orders
    const orders = await OrderHistoryModel.insertMany(mockCourierOrders);
    console.log(`✅ Created ${orders.length} courier orders`);

    // Test the service
    const result = await CourierOrdersService.getCourierOrders(1, 10);
    console.log(`📊 Test query returned ${result.orders.length} orders out of ${result.pagination.total} total`);

    // Test stats
    const stats = await CourierOrdersService.getCourierOrdersStats();
    console.log('📈 Courier Orders Stats:', stats);

  } catch (error) {
    console.error('❌ Error seeding courier orders:', error);
  }
}

// Run if called directly
if (require.main === module) {
  // This would need to be run with proper database connection
  console.log('To seed courier orders, run this script with proper database connection');
}
