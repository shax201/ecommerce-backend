import { z } from 'zod';

const clientValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    firstName: z.string().min(1, { message: 'First name is required' }).optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }).optional(),
    phone: z
      .number({ invalid_type_error: 'Phone number must be a number' })
      .positive({ message: 'Phone number must be positive' })
      .optional(),
    address: z.string().min(1, { message: 'Address is required' }).optional(),
    status: z.boolean().optional().default(true),
    image: z.string().optional(),
  }),
});

const clientUpdateValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, { message: 'First name is required' }).optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }).optional(),
    phone: z
      .number({ invalid_type_error: 'Phone number must be a number' })
      .positive({ message: 'Phone number must be positive' })
      .optional(),
    address: z.string().min(1, { message: 'Address is required' }).optional(),
    status: z.boolean().optional(),
    image: z.string().optional(),
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
  oldPassword: z.string().min(6, { message: "Old password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
});

export const ClientValidation = {
    clientValidationSchema,
    clientUpdateValidationSchema,
    clientLoginValidationSchema,
    updatePasswordSchema
}
