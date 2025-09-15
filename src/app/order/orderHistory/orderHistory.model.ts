import { model, Schema } from "mongoose";
import { TOrderHistory } from "./orderHistory.interface";

const orderHistorySchema = new Schema<TOrderHistory>({
    productID: { 
        type: [Schema.Types.ObjectId], 
        ref: 'Product', 
        required: true,
        validate: {
            validator: function(v: any[]) {
                return v && v.length > 0;
            },
            message: 'At least one product is required'
        }
    },
    clientID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Client', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    totalPrice: { 
        type: Number, 
        required: true,
        min: [0, 'Total price must be non-negative']
    },
    originalPrice: { 
        type: Number, 
        required: false,
        min: [0, 'Original price must be non-negative']
    },
    discountAmount: { 
        type: Number, 
        required: false,
        min: [0, 'Discount amount must be non-negative']
    },
    couponCode: { 
        type: String, 
        required: false,
        uppercase: true,
        trim: true
    },
    couponId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Coupon', 
        required: false 
    },
    estimatedDeliveryDate: { 
        type: Date, 
        required: false,
        validate: {
            validator: function(v: Date) {
                return !v || v > new Date();
            },
            message: 'Delivery date must be in the future'
        }
    },

    trackingSteps: { 
        type: [String], 
        enum: ['pending',"ordered", 'processing', 'shipped', 'delivered', 'canceled'], 
        required: false, 
        default: ['pending'],
        validate: {
            validator: function(v: string[]) {
                return v && v.length > 0;
            },
            message: 'At least one tracking step is required'
        }
    },
    paymentMethod: { 
        type: String, 
        required: true,
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'],
        message: 'Invalid payment method'
    },
    paymentStatus: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    shipping: { 
        type: Schema.Types.ObjectId, 
        ref: 'ShippingAddress', 
        required: true 
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Indexes for better performance
orderHistorySchema.index({ clientID: 1, createdAt: -1 });
// orderNumber index is automatically created by unique: true
orderHistorySchema.index({ status: 1 });
orderHistorySchema.index({ paymentStatus: 1 });

// Pre-save middleware to generate order number
orderHistorySchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.orderNumber = `ORD-${year}-${random}`;
    }
    next();
});

const OrderHistoryModel = model<TOrderHistory>('OrderHistory', orderHistorySchema);
export default OrderHistoryModel;