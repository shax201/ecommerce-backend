import { Types } from "mongoose"

export type TAdmin = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    permission?: object;
    roles?: Types.ObjectId[];
    status: boolean;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}