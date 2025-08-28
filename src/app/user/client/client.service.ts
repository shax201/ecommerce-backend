import { TClient } from "./client.interface";
import ClientModel from "./client.model";
import * as argon2 from 'argon2';
import * as jose from 'jose';
import { config } from '../../../config';

const createClient = async (payload: TClient) => {
    // Hash the password before storing
    const hashedPassword = await argon2.hash(payload.password);
    
    // Create client with hashed password
    const client = await ClientModel.create({
        ...payload,
        password: hashedPassword
    });
    
    // Return client without password
    const clientObject = client.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = clientObject;

    return clientWithoutPassword;
};

const getAllClient = async () => {
    const clients = await ClientModel.find().select('-password').lean<TClient[]>();
    return clients;
};

const getClientById = async (id: string) => {
    const client = await ClientModel.findById(id).select('-password').lean<TClient>();
    return client;
};

const updateClient = async (id: string, payload: Partial<TClient>) => {
    // If password is being updated, hash it
    if (payload.password) {
        payload.password = await argon2.hash(payload.password);
    }
    
    const client = await ClientModel.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    ).select('-password').lean<TClient>();
    return client;
};

const deleteClient = async (id: string) => {
    const client = await ClientModel.findByIdAndDelete(id);
    return client;
};

const loginClient = async (email: string, password: string) => {
    // Find client by email
    const client = await ClientModel.findOne({ email }).lean<TClient>();
    
    if (!client) {
        throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await argon2.verify(client.password, password);
    
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const secret = new TextEncoder().encode(config.jwt_secret);
    
    const token = await new jose.SignJWT({ 
        userId: String(client._id),
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        role: 'client'
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt_expires_in)
    .sign(secret);
    
    // Return client data without password and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...clientWithoutPassword } = client;
    
    return {
        client: clientWithoutPassword,
        token
    };
};


 const updateClientProfile = async (
  clientId: string,
  updateData: Partial<TClient>
) => {
  try {
    // Fields that should not be changed directly
    const disallowedFields = ["password", "email"];
    disallowedFields.forEach((field) => {
      if (field in updateData) {
        delete (updateData as any)[field];
      }
    });

    const updatedClient = await ClientModel.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      throw new Error("Client not found");
    }

    return updatedClient;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const ClientServices = {
    createClient,
    getAllClient,
    getClientById,
    updateClient,
    deleteClient,
    loginClient,
    updateClientProfile
};
