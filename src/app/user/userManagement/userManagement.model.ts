import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
}, { _id: false });

const preferencesSchema = new Schema({
  language: { type: String, default: 'en' },
  currency: { type: String, default: 'USD' },
  notifications: { type: Boolean, default: true },
}, { _id: false });

const userManagementSchema = new Schema<IUserManagement>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'client'],
    default: 'client',
    index: true,
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  address: {
    type: addressSchema,
    default: {},
  },
  preferences: {
    type: preferencesSchema,
    default: {},
  },
  permissions: [{
    type: String,
    trim: true,
  }],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include password in queries by default
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...safeRet } = ret;
      return safeRet;
    },
  },
});

// Indexes for better query performance
userManagementSchema.index({ role: 1, status: 1 });
userManagementSchema.index({ createdAt: -1 });
userManagementSchema.index({ lastLogin: -1 });
userManagementSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Pre-save middleware to hash password
userManagementSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userManagementSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
userManagementSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userManagementSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' });
};

// Static method to find users by role
userManagementSchema.statics.findByRole = function(role: 'admin' | 'client') {
  return this.find({ role, status: 'active' });
};

// Static method to search users
userManagementSchema.statics.searchUsers = function(searchTerm: string, filters: any = {}) {
  const query: any = {
    $or: [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ],
    ...filters,
  };
  
  return this.find(query);
};

// Virtual for full name
userManagementSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userManagementSchema.set('toJSON', {
  virtuals: true,
});

export const UserManagementModel = mongoose.model<IUserManagement>('UserManagement', userManagementSchema);
