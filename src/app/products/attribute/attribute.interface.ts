import { Types } from 'mongoose';

export type TColor = {
    color: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TSize = {
    size: string;
    createdAt?: Date;
    updatedAt?: Date;
};

// Flexible payload types that can handle both single and multiple items
export type TColorPayload = {
    color?: string;
    colors?: string[];
};

export type TSizePayload = {
    size?: string;
    sizes?: string[];
};