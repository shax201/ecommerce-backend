import mongoose, { Schema } from 'mongoose';
import { ILogo, IHeroSection, IClientLogo, IFooterSection, IFooterLink, IContactInfo, IFooter, INavbarMenuItem, INavbarMenu, INavbar, IDynamicMenuItem, IDynamicMenu } from './content.interface';

// Logo Schema
const logoSchema = new Schema<ILogo>({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  altText: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['main', 'footer', 'favicon'], 
    required: true,
    default: 'main'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hero Section Schema
const heroSectionSchema = new Schema<IHeroSection>({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  primaryButtonText: { type: String },
  primaryButtonLink: { type: String },
  secondaryButtonText: { type: String },
  secondaryButtonLink: { type: String },
  backgroundImage: { type: String },
  backgroundImageAlt: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

// Client Logo Schema
const clientLogoSchema = new Schema<IClientLogo>({
  name: { type: String, required: true },
  description: { type: String },
  logoUrl: { type: String, required: true },
  websiteUrl: { type: String },
  altText: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

// Footer Link Schema
const footerLinkSchema = new Schema<IFooterLink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  isExternal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { _id: true });

// Footer Section Schema
const footerSectionSchema = new Schema<IFooterSection>({
  title: { type: String, required: true },
  links: [footerLinkSchema],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

// Contact Info Schema
const contactInfoSchema = new Schema<IContactInfo>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    github: { type: String }
  }
}, { _id: false });

// Footer Schema
const footerSchema = new Schema<IFooter>({
  sections: [footerSectionSchema],
  contactInfo: contactInfoSchema,
  copyright: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String },
  logoAlt: { type: String }
}, { timestamps: true });

// Navbar Menu Item Schema
const navbarMenuItemSchema = new Schema<INavbarMenuItem>({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { _id: true });

// Navbar Menu Schema
const navbarMenuSchema = new Schema<INavbarMenu>({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['MenuItem', 'MenuList'], 
    required: true 
  },
  url: { type: String },
  children: [navbarMenuItemSchema],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

// Navbar Schema
const navbarSchema = new Schema<INavbar>({
  menus: [navbarMenuSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Dynamic Menu Item Schema
const dynamicMenuItemSchema = new Schema<IDynamicMenuItem>({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  isExternal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 },
  parentId: { type: Number },
  children: { type: [Schema.Types.Mixed], default: [] }
}, { _id: true });

// Dynamic Menu Schema
const dynamicMenuSchema = new Schema<IDynamicMenu>({
  name: { type: String, required: true },
  description: { type: String },
  slug: { type: String, required: true, unique: true },
  items: [dynamicMenuItemSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create models
export const LogoModel = mongoose.model<ILogo>('Logo', logoSchema);
export const HeroSectionModel = mongoose.model<IHeroSection>('HeroSection', heroSectionSchema);
export const ClientLogoModel = mongoose.model<IClientLogo>('ClientLogo', clientLogoSchema);
export const FooterSectionModel = mongoose.model<IFooterSection>('FooterSection', footerSectionSchema);
export const FooterModel = mongoose.model<IFooter>('Footer', footerSchema);
export const NavbarModel = mongoose.model<INavbar>('Navbar', navbarSchema);
export const DynamicMenuModel = mongoose.model<IDynamicMenu>('DynamicMenu', dynamicMenuSchema);
