import { z } from 'zod';

// Update profile validation schema (names only)
export const updateProfileValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  }),
});

// Update email validation schema
export const updateEmailValidationSchema = z.object({
  body: z.object({
    newEmail: z.string().email('Invalid email format'),
    currentPassword: z.string().min(1, 'Current password is required for email change'),
  }),
});

// Change password validation schema (for user's own password)
export const changeOwnPasswordValidationSchema = z.object({
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

// Update phone validation schema
export const updatePhoneValidationSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 characters').max(15, 'Phone number must be less than 15 characters').optional(),
  }),
});

// Update preferences validation schema
export const updatePreferencesValidationSchema = z.object({
  body: z.object({
    language: z.string().min(2, 'Language must be at least 2 characters').max(10, 'Language must be less than 10 characters').optional(),
    currency: z.string().min(3, 'Currency must be at least 3 characters').max(10, 'Currency must be less than 10 characters').optional(),
    notifications: z.boolean().optional(),
  }),
});

// Get own profile validation schema
export const getOwnProfileValidationSchema = z.object({
  params: z.object({}), // No params needed for own profile
});

// Export validation schemas
export const UserSettingsValidation = {
  updateProfileValidationSchema,
  updateEmailValidationSchema,
  changeOwnPasswordValidationSchema,
  updatePhoneValidationSchema,
  updatePreferencesValidationSchema,
  getOwnProfileValidationSchema,
};
