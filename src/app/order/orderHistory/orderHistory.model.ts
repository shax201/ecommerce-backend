import { model, Schema } from "mongoose";
import { TOrderHistory } from "./orderHistory.interface";

const orderHistoryShema = new Schema<TOrderHistory>({
    productID: { type: [Schema.Types.ObjectId], ref: 'Product', required: true },
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    estimatedDeliveryDate: { type: Date, required: false }, // New field
    trackingSteps: { 
        type: [String], 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
        required: false, 
        default: ['pending'] 
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, required: true, default: false },
    shipping: { type: Schema.Types.ObjectId, ref: 'ShippingAddress', required: true },
}, {
    timestamps: true
})

const OrderHistoryModel = model<TOrderHistory>('OrderHistory', orderHistoryShema);
export default OrderHistoryModel;