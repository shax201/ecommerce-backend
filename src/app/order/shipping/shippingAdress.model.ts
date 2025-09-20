import { model, Schema } from "mongoose";
import { TShippingAddress } from "./shippingAddress.interface";

const shippingAddressSchema = new Schema<TShippingAddress> ({
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'UserManagement', required: true },
    name: { type: String, required: true }, // Add name field for address
}, {
    timestamps: true
})

const ShippingAddressModel = model<TShippingAddress>('ShippingAddress', shippingAddressSchema);
export default ShippingAddressModel;