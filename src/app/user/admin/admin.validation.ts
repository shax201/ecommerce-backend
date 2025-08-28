import { z } from 'zod';

const adminValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    permission: z.object({}).passthrough().optional(),
    status: z.boolean().default(true),
    image: z.string().optional(),
  }),
});

const adminUpdateValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, { message: 'First name is required' }).optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }).optional(),
    permission: z.object({}).passthrough().optional(),
    status: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

const adminLoginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export const AdminValidation = {
    adminValidationSchema,
    adminUpdateValidationSchema,
    adminLoginValidationSchema
} 