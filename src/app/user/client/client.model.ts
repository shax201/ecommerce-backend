import { model, Schema } from "mongoose";
import { TClient } from "./client.interface";

const clientShema = new Schema<TClient> ({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: false },
    status: { type: Boolean, required: true , default: true },
    image: { type: String, required: false },
}, {timestamps: true})

const ClientModel = model<TClient>('Client', clientShema);
export default ClientModel;