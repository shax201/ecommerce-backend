export interface ILogo {
  _id?: string;
  name: string;
  description?: string;
  url: string;
  altText: string;
  type: 'main' | 'footer' | 'favicon';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHeroSection {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClientLogo {
  _id?: string;
  name: string;
  description?: string;
  logoUrl: string;
  websiteUrl?: string;
  altText: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFooterLink {
  _id?: string;
  title: string;
  url: string;
  isExternal: boolean;
  isActive: boolean;
  order: number;
}

export interface IFooterSection {
  _id?: string;
  title: string;
  links: IFooterLink[];
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
}

export interface IFooter {
  _id?: string;
  sections: IFooterSection[];
  contactInfo: IContactInfo;
  copyright: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Request/Response interfaces
export interface CreateLogoRequest {
  name: string;
  description?: string;
  url: string;
  altText: string;
  type: 'main' | 'footer' | 'favicon';
  isActive?: boolean;
}

export interface UpdateLogoRequest {
  name?: string;
  description?: string;
  url?: string;
  altText?: string;
  type?: 'main' | 'footer' | 'favicon';
  isActive?: boolean;
}

export interface CreateHeroSectionRequest {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateHeroSectionRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateClientLogoRequest {
  name: string;
  description?: string;
  logoUrl: string;
  websiteUrl?: string;
  altText: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateClientLogoRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  altText?: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateFooterSectionRequest {
  title: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateFooterSectionRequest {
  title?: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateFooterLinkRequest {
  title: string;
  url: string;
  isExternal?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface UpdateFooterLinkRequest {
  title?: string;
  url?: string;
  isExternal?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface UpdateContactInfoRequest {
  email?: string;
  phone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
}

export interface UpdateFooterRequest {
  sections?: IFooterSection[];
  contactInfo?: IContactInfo;
  copyright?: string;
  description?: string;
  logoUrl?: string;
  logoAlt?: string;
}

// Navbar Interfaces
export interface INavbarMenuItem {
  _id?: string;
  id: number;
  label: string;
  url: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INavbarMenuList {
  _id?: string;
  id: number;
  label: string;
  type: 'MenuList';
  children: INavbarMenuItem[];
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INavbarMenu {
  _id?: string;
  id: number;
  label: string;
  type: 'MenuItem' | 'MenuList';
  url?: string;
  children?: INavbarMenuItem[];
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INavbar {
  _id?: string;
  menus: INavbarMenu[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Navbar Request/Response interfaces
export interface CreateNavbarMenuItemRequest {
  id: number;
  label: string;
  url: string;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateNavbarMenuItemRequest {
  label?: string;
  url?: string;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface CreateNavbarMenuListRequest {
  id: number;
  label: string;
  children: CreateNavbarMenuItemRequest[];
  isActive?: boolean;
  order?: number;
}

export interface UpdateNavbarMenuListRequest {
  label?: string;
  children?: CreateNavbarMenuItemRequest[];
  isActive?: boolean;
  order?: number;
}

export interface CreateNavbarMenuRequest {
  id: number;
  label: string;
  type: 'MenuItem' | 'MenuList';
  url?: string;
  children?: CreateNavbarMenuItemRequest[];
  isActive?: boolean;
  order?: number;
}

export interface UpdateNavbarMenuRequest {
  label?: string;
  type?: 'MenuItem' | 'MenuList';
  url?: string;
  children?: CreateNavbarMenuItemRequest[];
  isActive?: boolean;
  order?: number;
}

export interface CreateNavbarRequest {
  menus: CreateNavbarMenuRequest[];
  isActive?: boolean;
}

export interface UpdateNavbarRequest {
  menus?: CreateNavbarMenuRequest[];
  isActive?: boolean;
}

// Dynamic Menu Interfaces
export interface IDynamicMenuItem {
  id: number;
  label: string;
  url: string;
  description?: string;
  icon?: string;
  isExternal?: boolean;
  isActive: boolean;
  order: number;
  parentId?: number;
  children?: IDynamicMenuItem[];
}

export interface IDynamicMenu {
  _id?: string;
  name: string;
  description?: string;
  slug: string;
  items: IDynamicMenuItem[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDynamicMenuRequest {
  name: string;
  description?: string;
  slug: string;
  isActive?: boolean;
}

export interface UpdateDynamicMenuRequest {
  name?: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
}

export interface CreateDynamicMenuItemRequest {
  label: string;
  url: string;
  description?: string;
  icon?: string;
  isExternal?: boolean;
  isActive?: boolean;
  order?: number;
  parentId?: number;
}

export interface UpdateDynamicMenuItemRequest {
  label?: string;
  url?: string;
  description?: string;
  icon?: string;
  isExternal?: boolean;
  isActive?: boolean;
  order?: number;
  parentId?: number;
}