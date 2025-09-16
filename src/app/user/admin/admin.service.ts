import { TAdmin } from "./admin.interface";
import AdminModel from "./admin.model";
import * as argon2 from 'argon2';
import * as jose from 'jose';
import { config } from '../../../config';

const createAdmin = async (payload: TAdmin) => {
    // Hash the password before storing
    const hashedPassword = await argon2.hash(payload.password);
    
    // Create admin with hashed password
    const admin = await AdminModel.create({
        ...payload,
        password: hashedPassword
    });
    
    // Return admin without password
    const adminObject = admin.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...adminWithoutPassword } = adminObject;
    return adminWithoutPassword;
};

const getAllAdmin = async () => {
    const admins = await AdminModel.find().select('-password').lean<TAdmin[]>();
    return admins;
};

const getAdminById = async (id: string) => {
    const admin = await AdminModel.findById(id).select('-password').lean<TAdmin>();
    return admin;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
    // If password is being updated, hash it
    if (payload.password) {
        payload.password = await argon2.hash(payload.password);
    }
    
    const admin = await AdminModel.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    ).select('-password').lean<TAdmin>();
    return admin;
};

const deleteAdmin = async (id: string) => {
    const admin = await AdminModel.findByIdAndDelete(id);
    return admin;
};

const loginAdmin = async (email: string, password: string) => {
    // Find admin by email
    const admin:any = await AdminModel.findOne({ email }).lean<TAdmin>();

    if (!admin) {
        throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await argon2.verify(admin.password, password);
    
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const secret = new TextEncoder().encode(config.jwt_secret);
    
    const token = await new jose.SignJWT({ 
        userId: admin._id.toString(),
        email: admin.email,
        role: 'admin'
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt_expires_in)
    .sign(secret);
    
    // Return admin data without password and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminWithoutPassword } = admin;

    return {
        admin: adminWithoutPassword,
        token
    };
};

export const AdminServices = {
    createAdmin,
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    loginAdmin
}; 