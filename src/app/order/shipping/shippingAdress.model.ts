import { model, Schema } from "mongoose";
import { TShippingAddress } from "./shippingAddress.interface";

const shippingAdressShema = new Schema<TShippingAddress> ({
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },

    
})

const ShippingAddressModel = model<TShippingAddress>('ShippingAddress', shippingAdressShema);
export default ShippingAddressModel;