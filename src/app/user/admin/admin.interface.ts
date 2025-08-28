import { Types } from "mongoose"

export type TAdmin = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    permission?: object;
    status: boolean;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}