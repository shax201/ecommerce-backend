import { Types } from "mongoose";

export type TOrderHistoryBase = {
    productID: Types.ObjectId[];
    clientID: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    estimatedDeliveryDate?: Date;
    trackingSteps: ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')[];
    paymentMethod: string;
    paymentStatus: boolean;
};

export type TOrderHistory = TOrderHistoryBase & {
    shipping: Types.ObjectId;
};