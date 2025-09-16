import { Types } from "mongoose";

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type PermissionResource = 
  | 'users' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'coupons' 
  | 'content' 
  | 'reports' 
  | 'company-settings'
  | 'shipping-addresses';

export interface IPermission {
  _id?: string;
  name: string;
  resource: PermissionResource;
  action: PermissionAction;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRole {
  _id?: string;
  name: string;
  description?: string;
  permissions: Types.ObjectId[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRole {
  _id?: string;
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPermissionCheck {
  userId: string;
  resource: PermissionResource;
  action: PermissionAction;
}

export interface IPermissionResult {
  hasPermission: boolean;
  reason?: string;
}
