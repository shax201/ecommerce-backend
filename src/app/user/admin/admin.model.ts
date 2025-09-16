import { model, Schema } from "mongoose";
import { TAdmin } from "./admin.interface";

const adminSchema = new Schema<TAdmin>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: Object },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    status: { type: Boolean, required: true, default: true },
    image: { type: String, required: false },
}, { timestamps: true });

const AdminModel = model<TAdmin>('Admin', adminSchema);
export default AdminModel;