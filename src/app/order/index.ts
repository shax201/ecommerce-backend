// Order Module - Unified exports

// Routes
export { OrderRoutes } from './orderHistory/orderHistory.route';
export { ShippingAddressRoutes } from './shipping/shippingAdress.route';
export { OrderTrackingRoutes } from './orderTracking.route';
export { OrderAnalyticsRoutes } from './orderAnalytics.route';

// Order History exports
export { OrderControllers } from './orderHistory/orderHistory.controller';
export { OrderServices } from './orderHistory/orderHistory.service';
export { default as OrderHistoryModel } from './orderHistory/orderHistory.model';
export * from './orderHistory/orderHistory.interface';

// Shipping Address exports
export { ShippingAddressControllers } from './shipping/shippingAdress.controller';
export { ShippingAddressServices } from './shipping/shippingAdress.service';
export { default as ShippingAddressModel } from './shipping/shippingAdress.model';
export * from './shipping/shippingAddress.interface';

// Order Tracking exports
export { OrderTrackingControllers } from './orderTracking.controller';
export { OrderTrackingService } from './orderTracking.service';

// Order Analytics exports
export { OrderAnalyticsControllers } from './orderAnalytics.controller';
export { OrderAnalyticsService } from './orderAnalytics.service';

// Error Handling exports
export { OrderErrorHandler, asyncHandler } from './orderErrorHandler';

// Validation exports
export * from './order.validation';
