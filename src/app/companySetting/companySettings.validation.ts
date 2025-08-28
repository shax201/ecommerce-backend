import { z } from "zod";

export const companySettingsSchema = z.object({
  companyName: z.string().min(2).max(100),
  logo: z.string().min(2).max(100),
  description: z.string().optional(),
  gtmScript: z.string(),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().regex(/^[+]?[1-9][\d]{0,15}$/),
    fax: z.string().optional(),
    website: z.string().url().optional(),
    socialMedia: z
      .object({
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
        facebook: z.string().url().optional(),
        instagram: z.string().url().optional(),
      })
      .optional(),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string(),
  }),
  additionalFields: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
        type: z.enum(["text", "number", "email", "url", "date", "boolean"]),
        required: z.boolean(),
        category: z.string().optional(),
        order: z.number(),
      })
    )
    .optional(),
  preferences: z
    .object({
      timezone: z.string().default("UTC"),
      currency: z.string().default("USD"),
      dateFormat: z.string().default("MM/DD/YYYY"),
      language: z.string().default("en"),
    })
    .optional(),
});
