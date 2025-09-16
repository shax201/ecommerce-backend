import { z } from 'zod';

const clientValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    phone: z
      .number({ invalid_type_error: 'Phone number must be a number' })
      .positive({ message: 'Phone number must be positive' })
      .optional(),
    address: z.string().min(1, { message: 'Address is required' }).optional(),
    status: z.boolean().optional().default(true),
    image: z.string().url().optional(),
  }),
});

const clientUpdateValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }).optional(),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .optional(),
    phone: z
      .number({ invalid_type_error: 'Phone number must be a number' })
      .positive({ message: 'Phone number must be positive' })
      .optional(),
    address: z.string().min(1, { message: 'Address is required' }).optional(),
    status: z.boolean().optional(),
    image: z.string().url().optional(),
  }),
});

const clientLoginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});


export const updatePasswordSchema = z.object({
  clientId: z.string().length(24, { message: "Invalid client ID" }), // MongoDB ObjectId length
  oldPassword: z.string().min(1, { message: "Old password is required" }),
  newPassword: z.string()
    .min(8, { message: "New password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const ClientValidation = {
    clientValidationSchema,
    clientUpdateValidationSchema,
    clientLoginValidationSchema,
    updatePasswordSchema
}
