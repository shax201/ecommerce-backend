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
        ref: 'UserManagement', 
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
        enum: ['pending',"ordered", 'processing', 'shipped', 'delivered', 'cancelled'], 
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
    },
    courierBooking: {
        type: String,
        enum: ['pathao', 'steadfast'],
        required: false
    },
    courierStatus: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned', 'cancelled'],
        required: false
    },
    consignmentId: {
        type: String,
        required: false
    },
    trackingNumber: {
        type: String,
        required: false
    },
    courierDeliveryFee: {
        type: Number,
        required: false,
        min: [0, 'Delivery fee must be non-negative']
    },
    courierEstimatedDelivery: {
        type: Date,
        required: false
    },
    courierTrackingSteps: [{
        status: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: false
        },
        note: {
            type: String,
            required: false
        }
    }]
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