// Common types for all courier operations

export interface ICourierOrderData {
  // Common order fields
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerArea: string;
  customerPostCode?: string;
  
  // Product details
  items: Array<{
    name: string;
    quantity: number;
    weight: number; // in kg
    price: number;
  }>;
  
  // Delivery details
  deliveryCharge: number;
  totalAmount: number;
  notes?: string;
  
  // Courier-specific fields
  merchantOrderId?: string;
  itemType?: string;
  itemQuantity?: number;
  itemWeight?: number;
  itemPrice?: number;
  deliveryType?: string;
  itemCategory?: string;
  itemSubCategory?: string;
}

export interface ICourierResponse {
  success: boolean;
  data?: any;
  error?: string;
  consignmentId?: string;
  trackingNumber?: string;
  deliveryFee?: number;
  estimatedDeliveryTime?: string;
}

export interface ICourierStatusResponse {
  success: boolean;
  status?: string;
  trackingSteps?: Array<{
    status: string;
    timestamp: string;
    location?: string;
    note?: string;
  }>;
  error?: string;
}

export interface ICourierPriceResponse {
  success: boolean;
  deliveryFee?: number;
  estimatedDeliveryTime?: string;
  error?: string;
}

export interface ICourierAdapter {
  createOrder(orderData: ICourierOrderData): Promise<ICourierResponse>;
  bulkOrder(orderList: ICourierOrderData[]): Promise<ICourierResponse>;
  getStatus(consignmentId: string): Promise<ICourierStatusResponse>;
  calculatePrice?(params: any): Promise<ICourierPriceResponse>;
}

export type CourierType = 'pathao' | 'steadfast';

export interface ICourierCredentials {
  courier: CourierType;
  credentials: any;
  isActive: boolean;
}
