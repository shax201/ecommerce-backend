import { Types } from "mongoose";

export type TOrderHistoryBase = {
    productID: Types.ObjectId[];
    clientID: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    originalPrice?: number;
    discountAmount?: number;
    couponCode?: string;
    couponId?: Types.ObjectId;
    estimatedDeliveryDate?: Date;
    trackingSteps: ('pending' | 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled')[];
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
    paymentStatus: boolean;
    orderNumber: string;
    notes?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    courierBooking?: 'pathao' | 'steadfast';
    courierStatus?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed_delivery' | 'returned' | 'cancelled';
    consignmentId?: string;
    trackingNumber?: string;
    courierDeliveryFee?: number;
    courierEstimatedDelivery?: Date;
    courierTrackingSteps?: Array<{
        status: string;
        timestamp: Date;
        location?: string;
        note?: string;
    }>;
};

export type TOrderHistory = TOrderHistoryBase & {
    shipping: Types.ObjectId;
};

export type TCreateOrder = Omit<TOrderHistory, 'orderNumber' | 'status'> & {
    orderNumber?: string;
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
};

export type TUpdateOrder = Partial<Pick<TOrderHistory, 'trackingSteps' | 'paymentStatus' | 'estimatedDeliveryDate' | 'notes' | 'status'>>;