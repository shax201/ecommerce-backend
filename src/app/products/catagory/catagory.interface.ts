import { Types } from 'mongoose';

export type TCatagory = {
    title: string;
    description: string;
    parent?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};