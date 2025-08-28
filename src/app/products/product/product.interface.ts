import { Types } from 'mongoose';
import { TOrderHistoryBase } from '../../order/orderHistory/orderHistory.interface';
import { TShippingAddress } from '../../order/shipping/shippingAddress.interface';

export type TProduct = {
    title: string;
    description: string;
    primaryImage: string;
    optionalImages?: string[];
    regularPrice: number;
    discountPrice: number;
    videoLink?: string;
    catagory: Types.ObjectId[];
    color: Types.ObjectId[];
    size: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type TProductPurchase = Omit<TOrderHistoryBase, 'productID' | 'clientID'> & {
    productID: string[];
    clientID: string;
    shipping: TShippingAddress;
};


// Query params for listing/filtering products
export type TProductQuery = {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'price';
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    color?: string[]; // Color codes (e.g., "#ffffff") or Color IDs
    size?: string[];  // Size values (e.g., "M") or Size IDs
    categories?: string[]; // Category IDs
};
