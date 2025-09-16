import { Document } from 'mongoose';

export interface IUserManagement extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'client';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  permissions?: string[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface IUserManagementCreate {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'client';
  password: string;
  status?: 'active' | 'inactive' | 'suspended';
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  permissions?: string[];
}

export interface IUserManagementUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: boolean;
  };
  permissions?: string[];
}

export interface IUserManagementQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'client';
  status?: 'active' | 'inactive' | 'suspended';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IUserManagementResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IUserManagementStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  adminUsers: number;
  clientUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  lastLoginStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface IUserManagementBulkOperation {
  userIds: string[];
  operation: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'changeRole';
  data?: {
    role?: 'admin' | 'client';
    status?: 'active' | 'inactive' | 'suspended';
    permissions?: string[];
  };
}
