import { z } from 'zod';

// Base user validation schema
const baseUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'client'], {
    errorMap: () => ({ message: 'Role must be either admin or client' })
  }),
  status: z.enum(['active', 'inactive', 'suspended']).optional().default('active'),
  profileImage: z.string().url().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  preferences: z.object({
    language: z.string().optional(),
    currency: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
  permissions: z.array(z.string()).optional(),
});

// Create user validation schema - only essential fields
export const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    role: z.enum(['admin', 'client'], {
      errorMap: () => ({ message: 'Role must be either admin or client' })
    }),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  }),
});

// Update user validation schema
export const updateUserValidationSchema = z.object({
  body: baseUserSchema.partial().omit({ email: true }),
});

// User query validation schema
export const userQueryValidationSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
    search: z.string().optional(),
    role: z.enum(['admin', 'client']).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }),
});

// User ID validation schema
export const userIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

// Bulk operation validation schema
export const bulkOperationValidationSchema = z.object({
  body: z.object({
    userIds: z.array(z.string().min(1, 'User ID is required')).min(1, 'At least one user ID is required'),
    operation: z.enum(['activate', 'deactivate', 'suspend', 'delete', 'changeRole']),
    data: z.object({
      role: z.enum(['admin', 'client']).optional(),
      status: z.enum(['active', 'inactive', 'suspended']).optional(),
    }).optional(),
  }),
});

// Password change validation schema
export const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});

// User status update validation schema
export const userStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'inactive', 'suspended']),
    reason: z.string().optional(),
  }),
});

// User role update validation schema
export const userRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(['admin', 'client']),
    permissions: z.array(z.string()).optional(),
  }),
});

// Export validation schemas
export const UserManagementValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  userQueryValidationSchema,
  userIdValidationSchema,
  bulkOperationValidationSchema,
  changePasswordValidationSchema,
  userStatusValidationSchema,
  userRoleValidationSchema,
};
