
import { Types } from "mongoose";

export type TShippingAddressBase = {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: number;
    isDefault: boolean;
    name: string;
};

export type TShippingAddress = TShippingAddressBase & {
    user: Types.ObjectId;
};