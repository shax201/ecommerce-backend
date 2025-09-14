import { Types } from "mongoose";

export type TOrderHistoryBase = {
    productID: Types.ObjectId[];
    clientID: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    estimatedDeliveryDate?: Date;
    trackingSteps: ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')[];
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
    paymentStatus: boolean;
    orderNumber: string;
    notes?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
};

export type TOrderHistory = TOrderHistoryBase & {
    shipping: Types.ObjectId;
};

export type TCreateOrder = Omit<TOrderHistory, 'orderNumber' | 'status'> & {
    orderNumber?: string;
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
};

export type TUpdateOrder = Partial<Pick<TOrderHistory, 'trackingSteps' | 'paymentStatus' | 'estimatedDeliveryDate' | 'notes' | 'status'>>;