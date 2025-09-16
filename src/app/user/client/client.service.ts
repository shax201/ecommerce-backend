import { TClient } from "./client.interface";
import { UserManagementService } from '../userManagement/userManagement.service';
import { IUserManagementCreate, IUserManagementUpdate } from '../userManagement/userManagement.interface';

const createClient = async (payload: TClient) => {
    // Convert TClient to IUserManagementCreate format
    const userData: IUserManagementCreate = {
        email: payload.email,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        phone: payload.phone?.toString(),
        role: 'client',
        password: payload.password,
        status: payload.status ? 'active' : 'inactive',
        profileImage: payload.image,
        address: payload.address ? {
            street: payload.address,
            city: '',
            state: '',
            zipCode: '',
            country: ''
        } : undefined
    };

    // Use user management service to create user
    const user = await UserManagementService.createUser(userData);
    
    // Convert back to TClient format for backward compatibility
    const clientData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? parseInt(user.phone) : undefined,
        address: user.address ? user.address.street : undefined,
        status: user.status === 'active',
        image: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    return clientData;
};

const getAllClient = async () => {
    const result = await UserManagementService.getAllUsers({
        role: 'client',
        page: 1,
        limit: 1000
    });
    
    // Convert user management format to TClient format
    const clients = result.users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? parseInt(user.phone) : undefined,
        address: user.address ? user.address.street : undefined,
        status: user.status === 'active',
        image: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }));
    
    return clients;
};

const getClientById = async (id: string) => {
    const user = await UserManagementService.getUserById(id);
    
    if (!user || user.role !== 'client') {
        return null;
    }
    
    // Convert user management format to TClient format
    const client = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? parseInt(user.phone) : undefined,
        address: user.address ? user.address.street : undefined,
        status: user.status === 'active',
        image: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    
    return client;
};

const updateClient = async (id: string, payload: Partial<TClient>) => {
    // Convert TClient format to IUserManagementUpdate format
    const updateData: IUserManagementUpdate = {};
    
    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.phone) updateData.phone = payload.phone.toString();
    if (payload.address) {
        updateData.address = {
            street: payload.address,
            city: '',
            state: '',
            zipCode: '',
            country: ''
        };
    }
    if (payload.status !== undefined) {
        updateData.status = payload.status ? 'active' : 'inactive';
    }
    if (payload.image) updateData.profileImage = payload.image;
    
    const user = await UserManagementService.updateUser(id, updateData);
    
    if (!user || user.role !== 'client') {
        return null;
    }
    
    // Convert back to TClient format
    const client = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? parseInt(user.phone) : undefined,
        address: user.address ? user.address.street : undefined,
        status: user.status === 'active',
        image: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    
    return client;
};

const deleteClient = async (id: string) => {
    // First check if user exists and is a client
    const user = await UserManagementService.getUserById(id);
    if (!user || user.role !== 'client') {
        return null;
    }
    
    const result = await UserManagementService.deleteUser(id);
    return result;
};

const loginClient = async (email: string, password: string) => {
    // Use user management service for login
    const result = await UserManagementService.loginUser(email, password);
    
    // Convert user management format to TClient format
    const client = {
        _id: result.user._id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        phone: result.user.phone ? parseInt(result.user.phone) : undefined,
        address: result.user.address ? result.user.address.street : undefined,
        status: result.user.status === 'active',
        image: result.user.profileImage,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt
    };
    
    return {
        client,
        token: result.token
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

    // Convert TClient format to IUserManagementUpdate format
    const userUpdateData: IUserManagementUpdate = {};
    
    if (updateData.firstName) userUpdateData.firstName = updateData.firstName;
    if (updateData.lastName) userUpdateData.lastName = updateData.lastName;
    if (updateData.phone) userUpdateData.phone = updateData.phone.toString();
    if (updateData.address) {
        userUpdateData.address = {
            street: updateData.address,
            city: '',
            state: '',
            zipCode: '',
            country: ''
        };
    }
    if (updateData.status !== undefined) {
        userUpdateData.status = updateData.status ? 'active' : 'inactive';
    }
    if (updateData.image) userUpdateData.profileImage = updateData.image;

    const updatedUser = await UserManagementService.updateUser(clientId, userUpdateData);

    if (!updatedUser || updatedUser.role !== 'client') {
      throw new Error("Client not found");
    }

    // Convert back to TClient format
    const client = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone ? parseInt(updatedUser.phone) : undefined,
        address: updatedUser.address ? updatedUser.address.street : undefined,
        status: updatedUser.status === 'active',
        image: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
    };

    return client;
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
