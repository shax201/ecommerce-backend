import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanyLogo {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  alt?: string;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IContactInfo {
  email: string;
  phone: string;
  fax?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface ICustomField {
  key: string;
  value: string;
  type: "text" | "number" | "email" | "url" | "date" | "boolean";
  required: boolean;
  category?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanySettings extends Document {
  companyName: string;
//   description?: string;
  logo?: ICompanyLogo;
  contactInfo: IContactInfo;
  address: IAddress;
  gtmScript: string;
  additionalFields: ICustomField[];
  businessInfo?: {
    taxId?: string;
    registrationNumber?: string;
    industry?: string;
    foundedYear?: number;
    employeeCount?: number;
    annualRevenue?: number;
  };
  preferences?: {
    timezone: string;
    currency: string;
    dateFormat: string;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

const CompanyLogoSchema = new Schema<ICompanyLogo>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    alt: String,
  },
  { _id: false }
);

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    country: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  { _id: false }
);

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fax: String,
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },
  },
  { _id: false }
);

const CustomFieldSchema = new Schema<ICustomField>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    type: { type: String, enum: ["text", "number", "email", "url", "date", "boolean"], required: true },
    required: { type: Boolean, default: false },
    category: String,
    order: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: { type: String, required: true },
    // description: String,
    logo: String,
    contactInfo: { type: ContactInfoSchema, required: true },
    address: { type: AddressSchema, required: true },
    additionalFields: [CustomFieldSchema],
    gtmScript:{type: String, required: true},
    businessInfo: {
      taxId: String,
      registrationNumber: String,
      industry: String,
      foundedYear: Number,
      employeeCount: Number,
      annualRevenue: Number,
    },
    preferences: {
      timezone: { type: String, default: "UTC" },
      currency: { type: String, default: "USD" },
      dateFormat: { type: String, default: "MM/DD/YYYY" },
      language: { type: String, default: "en" },
    },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const CompanySettings: Model<ICompanySettings> =
  mongoose.models.CompanySettings ||
  mongoose.model<ICompanySettings>("CompanySettings", CompanySettingsSchema);
