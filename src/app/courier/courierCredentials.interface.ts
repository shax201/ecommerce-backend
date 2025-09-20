import { Types } from "mongoose";

export interface ICourierCredentialsBase {
  courier: 'pathao' | 'steadfast';
  credentials: {
    // Pathao credentials
    client_id?: string;
    client_secret?: string;
    username?: string;
    password?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    base_url?: string;
    
    // Steadfast credentials
    api_key?: string;
    secret_key?: string;
  };
  isActive: boolean;
}

export interface ICourierCredentials extends ICourierCredentialsBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourierCredentials {
  courier: 'pathao' | 'steadfast';
  credentials: {
    // Pathao credentials
    client_id?: string;
    client_secret?: string;
    username?: string;
    password?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    base_url?: string;
    
    // Steadfast credentials
    api_key?: string;
    secret_key?: string;
  };
  isActive?: boolean;
}

export interface IUpdateCourierCredentials {
  credentials?: {
    client_id?: string;
    client_secret?: string;
    username?: string;
    password?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    base_url?: string;
    api_key?: string;
    secret_key?: string;
  };
  isActive?: boolean;
}

// Courier-specific credential types
export interface IPathaoCredentials {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  base_url: string;
}

export interface ISteadfastCredentials {
  api_key: string;
  secret_key: string;
  base_url: string;
}
