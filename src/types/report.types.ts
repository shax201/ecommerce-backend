// ===== REPORT TYPES =====

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status?: string;
  category?: string;
  product?: string;
  customer?: string;
  paymentMethod?: string;
  orderStatus?: string;
  couponCode?: string;
}

export interface ReportPeriod {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  filters: ReportFilters;
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  recordCount: number;
}

export type ReportType = 
  | 'sales'
  | 'orders'
  | 'products'
  | 'customers'
  | 'inventory'
  | 'coupons'
  | 'analytics'
  | 'financial'
  | 'custom';

export type ReportStatus = 
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed'
  | 'expired';

export type ReportFormat = 
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'json';

// ===== SALES REPORT TYPES =====

export interface SalesReportData {
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    totalRevenue: number;
    totalTax: number;
    totalDiscount: number;
    netRevenue: number;
  };
  dailySales: Array<{
    date: string;
    sales: number;
    orders: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
    profit: number;
  }>;
  salesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    sales: number;
    revenue: number;
    percentage: number;
  }>;
  salesByPaymentMethod: Array<{
    paymentMethod: string;
    sales: number;
    revenue: number;
    percentage: number;
  }>;
}

// ===== ORDERS REPORT TYPES =====

export interface OrdersReportData {
  summary: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalValue: number;
    averageOrderValue: number;
  };
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
    value: number;
  }>;
  ordersByMonth: Array<{
    month: string;
    orders: number;
    value: number;
    growth: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    orderCount: number;
    totalValue: number;
    lastOrderDate: string;
  }>;
  orderTimeline: Array<{
    date: string;
    orders: number;
    value: number;
  }>;
}

// ===== PRODUCTS REPORT TYPES =====

export interface ProductsReportData {
  summary: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
  };
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalValue: number;
    averagePrice: number;
  }>;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
    profit: number;
    stockLevel: number;
  }>;
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    minimumStock: number;
    category: string;
  }>;
  productPerformance: Array<{
    productId: string;
    productName: string;
    views: number;
    orders: number;
    conversionRate: number;
    revenue: number;
  }>;
}

// ===== CUSTOMERS REPORT TYPES =====

export interface CustomersReportData {
  summary: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    totalSpent: number;
    averageOrderValue: number;
  };
  customersByRegistration: Array<{
    month: string;
    newCustomers: number;
    totalCustomers: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    customerLifetimeValue: number;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
    averageValue: number;
  }>;
  customerActivity: Array<{
    date: string;
    newCustomers: number;
    activeCustomers: number;
    orders: number;
  }>;
}

// ===== INVENTORY REPORT TYPES =====

export interface InventoryReportData {
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    averageStockValue: number;
  };
  stockLevels: Array<{
    productId: string;
    productName: string;
    category: string;
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    stockValue: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
  }>;
  stockMovements: Array<{
    productId: string;
    productName: string;
    movementType: 'in' | 'out';
    quantity: number;
    date: string;
    reason: string;
  }>;
  categoryStock: Array<{
    categoryId: string;
    categoryName: string;
    totalProducts: number;
    totalValue: number;
    averageStock: number;
  }>;
}

// ===== COUPONS REPORT TYPES =====

export interface CouponsReportData {
  summary: {
    totalCoupons: number;
    activeCoupons: number;
    usedCoupons: number;
    totalDiscount: number;
    averageDiscount: number;
  };
  couponsByType: Array<{
    type: string;
    count: number;
    usage: number;
    totalDiscount: number;
  }>;
  topCoupons: Array<{
    couponId: string;
    couponCode: string;
    usageCount: number;
    totalDiscount: number;
    conversionRate: number;
  }>;
  couponPerformance: Array<{
    couponId: string;
    couponCode: string;
    createdDate: string;
    usageCount: number;
    totalDiscount: number;
    averageOrderValue: number;
  }>;
}

// ===== ANALYTICS REPORT TYPES =====

export interface AnalyticsReportData {
  summary: {
    totalVisitors: number;
    totalPageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversionRate: number;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    conversionRate: number;
  }>;
  pageViews: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    averageTime: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    orders: number;
    revenue: number;
  }>;
}

// ===== FINANCIAL REPORT TYPES =====

export interface FinancialReportData {
  summary: {
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  revenueBreakdown: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  costBreakdown: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
  monthlyFinancials: Array<{
    month: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
  }>;
}

// ===== API REQUEST/RESPONSE TYPES =====

export interface ReportGenerationRequest {
  type: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
  period: ReportPeriod;
  includeCharts?: boolean;
  includeDetails?: boolean;
  emailNotification?: boolean;
  emailAddress?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  format: ReportFormat;
  defaultFilters: Partial<ReportFilters>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExportOptions {
  format: ReportFormat;
  includeCharts: boolean;
  includeDetails: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  filters: Partial<ReportFilters>;
}
