import { model, Schema } from "mongoose";
import { IPermission, IRole, IUserRole } from "./permission.interface";

// Permission Schema
const permissionSchema = new Schema<IPermission>({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  resource: { 
    type: String, 
    required: true,
    enum: [
      'users', 
      'products', 
      'categories', 
      'orders', 
      'coupons', 
      'content', 
      'reports', 
      'company-settings',
      'shipping-addresses'
    ]
  },
  action: { 
    type: String, 
    required: true,
    enum: ['create', 'read', 'update', 'delete']
  },
  description: { 
    type: String, 
    trim: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Role Schema
const roleSchema = new Schema<IRole>({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  permissions: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Permission' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User Role Schema
const userRoleSchema = new Schema<IUserRole>({
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Admin' // This will reference either Admin or Client based on user type
  },
  roleId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Role' 
  },
  assignedBy: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Admin' 
  },
  assignedAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
permissionSchema.index({ resource: 1, action: 1 });
// Note: roleSchema already has unique index on name field, so no need to create another
userRoleSchema.index({ userId: 1, isActive: 1 });
userRoleSchema.index({ roleId: 1 });

// Virtual for permission string (resource:action)
permissionSchema.virtual('permissionString').get(function() {
  return `${this.resource}:${this.action}`;
});

// Virtual for role permissions count
roleSchema.virtual('permissionsCount').get(function() {
  return this.permissions.length;
});

// Models
export const PermissionModel = model<IPermission>('Permission', permissionSchema);
export const RoleModel = model<IRole>('Role', roleSchema);
export const UserRoleModel = model<IUserRole>('UserRole', userRoleSchema);
