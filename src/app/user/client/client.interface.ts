export type TClient = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: number,
    address?: string,
    status?: boolean,
    image?: string,
    createdAt?: Date,
    updatedAt?: Date
}