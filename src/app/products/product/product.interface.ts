import { Types } from 'mongoose';
import { TOrderHistoryBase } from '../../order/orderHistory/orderHistory.interface';
import { TShippingAddress } from '../../order/shipping/shippingAddress.interface';

export type TProductVariant = {
    sku: string;
    color: Types.ObjectId;
    size: Types.ObjectId;
    price: number;
    stock: number;
    images?: string[];
    isActive: boolean;
};

export type TProductSEO = {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    slug: string;
    canonicalUrl?: string;
};

export type TProductAnalytics = {
    views: number;
    purchases: number;
    wishlistCount: number;
    averageRating: number;
    totalReviews: number;
    lastViewed?: Date;
    lastPurchased?: Date;
};

export type TProduct = {
    title: string;
    description: string;
    shortDescription?: string;
    primaryImage: string;
    optionalImages?: string[];
    regularPrice: number;
    discountPrice: number;
    costPrice?: number;
    videoLink?: string;
    catagory: Types.ObjectId[];
    color: Types.ObjectId[];
    size: Types.ObjectId[];
    variants?: TProductVariant[];
    sku: string;
    barcode?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in';
    };
    inventory: {
        totalStock: number;
        reservedStock: number;
        availableStock: number;
        lowStockThreshold: number;
        trackInventory: boolean;
    };
    status: 'active' | 'inactive' | 'draft' | 'archived';
    featured: boolean;
    tags?: string[];
    seo?: TProductSEO;
    analytics?: TProductAnalytics;
    relatedProducts?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type TProductPurchase = Omit<TOrderHistoryBase, 'productID' | 'clientID'> & {
    productID: string[];
    user: string;
    shipping: TShippingAddress;
    couponCode?: string;
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
