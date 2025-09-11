import { 
  LogoModel, 
  HeroSectionModel, 
  ClientLogoModel, 
  FooterModel,
  NavbarModel,
  DynamicMenuModel
} from './content.model';
import { 
  ILogo, 
  IHeroSection, 
  IClientLogo, 
  IFooter,
  INavbar,
  IDynamicMenu,
  IDynamicMenuItem,
  CreateLogoRequest,
  UpdateLogoRequest,
  CreateHeroSectionRequest,
  UpdateHeroSectionRequest,
  CreateClientLogoRequest,
  UpdateClientLogoRequest,
  UpdateContactInfoRequest,
  UpdateFooterRequest,
  CreateNavbarRequest,
  UpdateNavbarRequest,
  CreateNavbarMenuRequest,
  UpdateNavbarMenuRequest,
  CreateNavbarMenuItemRequest,
  UpdateNavbarMenuItemRequest,
  CreateDynamicMenuRequest,
  UpdateDynamicMenuRequest,
  CreateDynamicMenuItemRequest,
  UpdateDynamicMenuItemRequest
} from './content.interface';

// Logo Service
export class LogoService {
  static async createLogo(data: CreateLogoRequest): Promise<ILogo> {
    const logo = new LogoModel(data);
    return await logo.save();
  }

  static async getLogos(filters: {
    type?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ logos: ILogo[]; total: number; page: number; totalPages: number }> {
    const { type, isActive, page = 1, limit = 10 } = filters;
    
    const query: any = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;
    
    const [logos, total] = await Promise.all([
      LogoModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LogoModel.countDocuments(query)
    ]);

    return {
      logos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getLogoById(id: string): Promise<ILogo | null> {
    return await LogoModel.findById(id).lean();
  }

  static async updateLogo(id: string, data: UpdateLogoRequest): Promise<ILogo | null> {
    return await LogoModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  static async deleteLogo(id: string): Promise<boolean> {
    const result = await LogoModel.findByIdAndDelete(id);
    return !!result;
  }

  static async getActiveLogosByType(type: string): Promise<ILogo[]> {
 
    return await LogoModel.find({isActive: true, type})
      .sort({ createdAt: -1 })
      .lean();
  }
}

// Hero Section Service
export class HeroSectionService {
  static async createHeroSection(data: CreateHeroSectionRequest): Promise<IHeroSection> {
    // If no order is provided, set it to the next available order
    if (!data.order) {
      const maxOrder = await HeroSectionModel.findOne({}, { order: 1 })
        .sort({ order: -1 })
        .lean();
      data.order = maxOrder ? maxOrder.order + 1 : 1;
    }

    const heroSection = new HeroSectionModel(data);
    return await heroSection.save();
  }

  static async getHeroSections(filters: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ heroSections: IHeroSection[]; total: number; page: number; totalPages: number }> {
    const { isActive, page = 1, limit = 10 } = filters;
    
    const query: any = {};
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;
    
    const [heroSections, total] = await Promise.all([
      HeroSectionModel.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HeroSectionModel.countDocuments(query)
    ]);

    return {
      heroSections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getHeroSectionById(id: string): Promise<IHeroSection | null> {
    return await HeroSectionModel.findById(id).lean();
  }

  static async updateHeroSection(id: string, data: UpdateHeroSectionRequest): Promise<IHeroSection | null> {
    return await HeroSectionModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  static async deleteHeroSection(id: string): Promise<boolean> {
    const result = await HeroSectionModel.findByIdAndDelete(id);
    return !!result;
  }

  static async getActiveHeroSections(): Promise<IHeroSection[]> {
    return await HeroSectionModel.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
  }

  static async reorderHeroSections(updates: { id: string; order: number }[]): Promise<void> {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { order: update.order, updatedAt: new Date() }
      }
    }));

    await HeroSectionModel.bulkWrite(bulkOps);
  }
}

// Client Logo Service
export class ClientLogoService {
  static async createClientLogo(data: CreateClientLogoRequest): Promise<IClientLogo> {
    // If no order is provided, set it to the next available order
    if (!data.order) {
      const maxOrder = await ClientLogoModel.findOne({}, { order: 1 })
        .sort({ order: -1 })
        .lean();
      data.order = maxOrder ? maxOrder.order + 1 : 1;
    }

    const clientLogo = new ClientLogoModel(data);
    return await clientLogo.save();
  }

  static async getClientLogos(filters: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ clientLogos: IClientLogo[]; total: number; page: number; totalPages: number }> {
    const { isActive, page = 1, limit = 10 } = filters;
    
    const query: any = {};
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;
    
    const [clientLogos, total] = await Promise.all([
      ClientLogoModel.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ClientLogoModel.countDocuments(query)
    ]);

    return {
      clientLogos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getClientLogoById(id: string): Promise<IClientLogo | null> {
    return await ClientLogoModel.findById(id).lean();
  }

  static async updateClientLogo(id: string, data: UpdateClientLogoRequest): Promise<IClientLogo | null> {
    return await ClientLogoModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  static async deleteClientLogo(id: string): Promise<boolean> {
    const result = await ClientLogoModel.findByIdAndDelete(id);
    return !!result;
  }

  static async getActiveClientLogos(): Promise<IClientLogo[]> {
    return await ClientLogoModel.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
  }

  static async reorderClientLogos(updates: { id: string; order: number }[]): Promise<void> {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { order: update.order, updatedAt: new Date() }
      }
    }));

    await ClientLogoModel.bulkWrite(bulkOps);
  }
}

// Footer Service
export class FooterService {
  static async getFooter(): Promise<IFooter | null> {
    let footer = await FooterModel.findOne().lean();
    
    // If no footer exists, create a default one
    if (!footer) {
      const defaultFooter: IFooter = {
        sections: [],
        contactInfo: {
          email: 'support@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345',
          socialMedia: {}
        },
        copyright: '© 2024 Your Company. All rights reserved.',
        description: 'Your company description here.',
        logoUrl: '',
        logoAlt: 'Company Logo'
      };
      
      const newFooter = new FooterModel(defaultFooter);
      footer = await newFooter.save();
    }
    
    return footer;
  }

  static async updateFooter(data: UpdateFooterRequest): Promise<IFooter | null> {
    let footer = await FooterModel.findOne();
    
    if (!footer) {
      // Create new footer if none exists
      const defaultFooter: IFooter = {
        sections: [],
        contactInfo: {
          email: 'support@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345',
          socialMedia: {}
        },
        copyright: '© 2024 Your Company. All rights reserved.',
        description: 'Your company description here.',
        logoUrl: '',
        logoAlt: 'Company Logo'
      };
      
      footer = new FooterModel({ ...defaultFooter, ...data });
    } else {
      // Update existing footer
      Object.assign(footer, data);
    }
    
    return await footer.save();
  }

  static async updateContactInfo(data: UpdateContactInfoRequest): Promise<IFooter | null> {
    let footer = await FooterModel.findOne();
    
    if (!footer) {
      // Create new footer with contact info
      const defaultFooter: IFooter = {
        sections: [],
        contactInfo: {
          email: 'support@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345',
          socialMedia: {}
        },
        copyright: '© 2024 Your Company. All rights reserved.',
        description: 'Your company description here.',
        logoUrl: '',
        logoAlt: 'Company Logo'
      };
      
      footer = new FooterModel({ ...defaultFooter, contactInfo: { ...defaultFooter.contactInfo, ...data } });
    } else {
      // Update existing contact info
      footer.contactInfo = { ...footer.contactInfo, ...data };
    }
    
    return await footer.save();
  }

  static async addFooterSection(sectionData: {
    title: string;
    isActive?: boolean;
    order?: number;
  }): Promise<IFooter | null> {
    let footer = await FooterModel.findOne();
    
    if (!footer) {
      // Create new footer with section
      const defaultFooter: IFooter = {
        sections: [],
        contactInfo: {
          email: 'support@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345',
          socialMedia: {}
        },
        copyright: '© 2024 Your Company. All rights reserved.',
        description: 'Your company description here.',
        logoUrl: '',
        logoAlt: 'Company Logo'
      };
      
      const newSection = {
        title: sectionData.title,
        links: [],
        isActive: sectionData.isActive ?? true,
        order: sectionData.order ?? (defaultFooter.sections.length + 1)
      };
      
      footer = new FooterModel({ ...defaultFooter, sections: [...defaultFooter.sections, newSection] });
    } else {
      // Add section to existing footer
      const newSection = {
        title: sectionData.title,
        links: [],
        isActive: sectionData.isActive ?? true,
        order: sectionData.order ?? (footer.sections.length + 1)
      };
      
      footer.sections.push(newSection);
    }
    
    return await footer.save();
  }

  static async updateFooterSection(sectionId: string, sectionData: {
    title?: string;
    isActive?: boolean;
    order?: number;
  }): Promise<IFooter | null> {
    const footer = await FooterModel.findOne();
    if (!footer) return null;

    const section = footer.sections.find(s => s._id?.toString() === sectionId);
    if (!section) return null;

    Object.assign(section, sectionData);
    return await footer.save();
  }

  static async deleteFooterSection(sectionId: string): Promise<IFooter | null> {
    const footer = await FooterModel.findOne();
    if (!footer) return null;

    footer.sections = footer.sections.filter(s => s._id?.toString() !== sectionId);
    return await footer.save();
  }

  static async addFooterLink(sectionId: string, linkData: {
    title: string;
    url: string;
    isExternal?: boolean;
    isActive?: boolean;
    order?: number;
  }): Promise<IFooter | null> {
    const footer = await FooterModel.findOne();
    if (!footer) return null;

    const section = footer.sections.find(s => s._id?.toString() === sectionId);
    if (!section) return null;

    const newLink = {
      title: linkData.title,
      url: linkData.url,
      isExternal: linkData.isExternal ?? false,
      isActive: linkData.isActive ?? true,
      order: linkData.order ?? (section.links.length + 1)
    };

    section.links.push(newLink);
    return await footer.save();
  }

  static async updateFooterLink(sectionId: string, linkId: string, linkData: {
    title?: string;
    url?: string;
    isExternal?: boolean;
    isActive?: boolean;
    order?: number;
  }): Promise<IFooter | null> {
    const footer = await FooterModel.findOne();
    if (!footer) return null;

    const section = footer.sections.find(s => s._id?.toString() === sectionId);
    if (!section) return null;

    const link = section.links.find(l => l._id?.toString() === linkId);
    if (!link) return null;

    Object.assign(link, linkData);
    return await footer.save();
  }

  static async deleteFooterLink(sectionId: string, linkId: string): Promise<IFooter | null> {
    const footer = await FooterModel.findOne();
    if (!footer) return null;

    const section = footer.sections.find(s => s._id?.toString() === sectionId);
    if (!section) return null;

    section.links = section.links.filter(l => l._id?.toString() !== linkId);
    return await footer.save();
  }
}

// Navbar Service
export class NavbarService {
  static async getNavbar(): Promise<INavbar | null> {
    let navbar = await NavbarModel.findOne().lean();
    
    // If no navbar exists, create a default one
    if (!navbar) {
      const defaultNavbar: INavbar = {
        menus: [
          {
            id: 1,
            label: "Shop",
            type: "MenuList",
            children: [
              {
                id: 11,
                label: "Men's clothes",
                url: "/shop#men-clothes",
                description: "In attractive and spectacular colors and designs",
                isActive: true,
                order: 1
              },
              {
                id: 12,
                label: "Women's clothes",
                url: "/shop#women-clothes",
                description: "Ladies, your style and tastes are important to us",
                isActive: true,
                order: 2
              },
              {
                id: 13,
                label: "Kids clothes",
                url: "/shop#kids-clothes",
                description: "For all ages, with happy and beautiful colors",
                isActive: true,
                order: 3
              },
              {
                id: 14,
                label: "Bags and Shoes",
                url: "/shop#bag-shoes",
                description: "Suitable for men, women and all tastes and styles",
                isActive: true,
                order: 4
              }
            ],
            isActive: true,
            order: 1
          },
          {
            id: 2,
            type: "MenuItem",
            label: "On Sale",
            url: "/shop#on-sale",
            isActive: true,
            order: 2
          },
          {
            id: 3,
            type: "MenuItem",
            label: "New Arrivals",
            url: "/shop#new-arrivals",
            isActive: true,
            order: 3
          },
          {
            id: 4,
            type: "MenuItem",
            label: "Brands",
            url: "/shop#brands",
            isActive: true,
            order: 4
          }
        ],
        isActive: true
      };
      
      const newNavbar = new NavbarModel(defaultNavbar);
      navbar = await newNavbar.save();
    }
    
    return navbar;
  }

  static async updateNavbar(data: UpdateNavbarRequest): Promise<INavbar | null> {
    let navbar = await NavbarModel.findOne();
    
    if (!navbar) {
      // Create new navbar if none exists
      const defaultNavbar: INavbar = {
        menus: [],
        isActive: true
      };
      
      navbar = new NavbarModel({ ...defaultNavbar, ...data });
    } else {
      // Update existing navbar
      Object.assign(navbar, data);
    }
    
    return await navbar.save();
  }

  static async addNavbarMenu(menuData: CreateNavbarMenuRequest): Promise<INavbar | null> {
    let navbar = await NavbarModel.findOne();
    
    if (!navbar) {
      // Create new navbar with menu
      const defaultNavbar: INavbar = {
        menus: [],
        isActive: true
      };
      
    const newMenu = {
      id: menuData.id,
      label: menuData.label,
      type: menuData.type,
      url: menuData.url,
      children: (menuData.children || []).map(child => ({
        ...child,
        isActive: child.isActive ?? true,
        order: child.order ?? 1
      })),
      isActive: menuData.isActive ?? true,
      order: menuData.order ?? (defaultNavbar.menus.length + 1)
    };
      
      navbar = new NavbarModel({ ...defaultNavbar, menus: [...defaultNavbar.menus, newMenu] });
    } else {
      // Add menu to existing navbar
      const newMenu = {
        id: menuData.id,
        label: menuData.label,
        type: menuData.type,
        url: menuData.url,
        children: (menuData.children || []).map(child => ({
          ...child,
          isActive: child.isActive ?? true,
          order: child.order ?? 1
        })),
        isActive: menuData.isActive ?? true,
        order: menuData.order ?? (navbar.menus.length + 1)
      };
      
      navbar.menus.push(newMenu);
    }
    
    return await navbar.save();
  }

  static async updateNavbarMenu(menuId: number, menuData: UpdateNavbarMenuRequest): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    const menu = navbar.menus.find(m => m.id === menuId);
    if (!menu) return null;

    Object.assign(menu, menuData);
    return await navbar.save();
  }

  static async deleteNavbarMenu(menuId: number): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    navbar.menus = navbar.menus.filter(m => m.id !== menuId);
    return await navbar.save();
  }

  static async addNavbarMenuItem(menuId: number, menuItemData: CreateNavbarMenuItemRequest): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    const menu = navbar.menus.find(m => m.id === menuId);
    if (!menu || menu.type !== 'MenuList' || !menu.children) return null;

    const newMenuItem = {
      id: menuItemData.id,
      label: menuItemData.label,
      url: menuItemData.url,
      description: menuItemData.description,
      isActive: menuItemData.isActive ?? true,
      order: menuItemData.order ?? (menu.children.length + 1)
    };

    menu.children.push(newMenuItem);
    return await navbar.save();
  }

  static async updateNavbarMenuItem(menuId: number, menuItemId: number, menuItemData: UpdateNavbarMenuItemRequest): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    const menu = navbar.menus.find(m => m.id === menuId);
    if (!menu || menu.type !== 'MenuList' || !menu.children) return null;

    const menuItem = menu.children.find(item => item.id === menuItemId);
    if (!menuItem) return null;

    Object.assign(menuItem, menuItemData);
    return await navbar.save();
  }

  static async deleteNavbarMenuItem(menuId: number, menuItemId: number): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    const menu = navbar.menus.find(m => m.id === menuId);
    if (!menu || menu.type !== 'MenuList' || !menu.children) return null;

    menu.children = menu.children.filter(item => item.id !== menuItemId);
    return await navbar.save();
  }

  static async reorderNavbarMenus(updates: { id: number; order: number }[]): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    updates.forEach(update => {
      const menu = navbar.menus.find(m => m.id === update.id);
      if (menu) {
        menu.order = update.order;
      }
    });

    // Sort menus by order
    navbar.menus.sort((a, b) => a.order - b.order);
    return await navbar.save();
  }

  static async reorderNavbarMenuItems(menuId: number, updates: { id: number; order: number }[]): Promise<INavbar | null> {
    const navbar = await NavbarModel.findOne();
    if (!navbar) return null;

    const menu = navbar.menus.find(m => m.id === menuId);
    if (!menu || menu.type !== 'MenuList' || !menu.children) return null;

    updates.forEach(update => {
      const menuItem = menu.children?.find(item => item.id === update.id);
      if (menuItem) {
        menuItem.order = update.order;
      }
    });

    // Sort menu items by order
    menu.children.sort((a, b) => a.order - b.order);
    return await navbar.save();
  }
}

// Dynamic Menu Service
export class DynamicMenuService {
  static async createDynamicMenu(data: CreateDynamicMenuRequest): Promise<IDynamicMenu> {
    const menu = new DynamicMenuModel({
      ...data,
      items: []
    });
    return await menu.save();
  }

  static async getDynamicMenus(filters: any = {}): Promise<{ menus: IDynamicMenu[], total: number, page: number, totalPages: number }> {
    const { isActive, page = 1, limit = 10 } = filters;
    const query: any = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    const menus = await DynamicMenuModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await DynamicMenuModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { menus, total, page, totalPages };
  }

  static async getDynamicMenuById(id: string): Promise<IDynamicMenu | null> {
    return await DynamicMenuModel.findById(id);
  }

  static async getDynamicMenuBySlug(slug: string): Promise<IDynamicMenu | null> {
    return await DynamicMenuModel.findOne({ slug });
  }

  static async updateDynamicMenu(id: string, data: UpdateDynamicMenuRequest): Promise<IDynamicMenu | null> {
    return await DynamicMenuModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteDynamicMenu(id: string): Promise<boolean> {
    const result = await DynamicMenuModel.findByIdAndDelete(id);
    return !!result;
  }

  static async createDynamicMenuItem(menuId: string, data: CreateDynamicMenuItemRequest): Promise<IDynamicMenu | null> {
    const menu = await DynamicMenuModel.findById(menuId);
    if (!menu) return null;

    // Generate new item ID
    const maxId = menu.items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: IDynamicMenuItem = {
      id: maxId + 1,
      label: data.label,
      url: data.url,
      description: data.description,
      icon: data.icon,
      isExternal: data.isExternal || false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: data.order || menu.items.length + 1,
      parentId: data.parentId,
      children: []
    };

    if (data.parentId) {
      // Add as child to parent item
      const parentItem = this.findMenuItemById(menu.items, data.parentId);
      if (parentItem) {
        parentItem.children = parentItem.children || [];
        parentItem.children.push(newItem);
      } else {
        // If parent not found, add as root item
        menu.items.push(newItem);
      }
    } else {
      // Add as root item
      menu.items.push(newItem);
    }

    return await menu.save();
  }

  static async updateDynamicMenuItem(menuId: string, itemId: number, data: UpdateDynamicMenuItemRequest): Promise<IDynamicMenu | null> {

    const menu = await DynamicMenuModel.findById(menuId);

    if (!menu) return null;

    console.log('itemId', itemId)
    const item = this.findMenuItemById(menu.items, itemId);

    console.log('item', item)
    if (!item) return null;

    // Update item properties
    if (data.label !== undefined) item.label = data.label;
    if (data.url !== undefined) item.url = data.url;
    if (data.description !== undefined) item.description = data.description;
    if (data.icon !== undefined) item.icon = data.icon;
    if (data.isExternal !== undefined) item.isExternal = data.isExternal;
    if (data.isActive !== undefined) item.isActive = data.isActive;
    if (data.order !== undefined) item.order = data.order;
    if (data.parentId !== undefined) item.parentId = data.parentId;

    return await menu.save();
  }

  static async deleteDynamicMenuItem(menuId: string, itemId: number): Promise<IDynamicMenu | null> {
    const menu = await DynamicMenuModel.findById(menuId);
    if (!menu) return null;

    // Remove item from menu
    this.removeMenuItemById(menu.items, itemId);
    return await menu.save();
  }

  static async reorderDynamicMenuItems(menuId: string, updates: { id: number, order: number }[]): Promise<IDynamicMenu | null> {
    const menu = await DynamicMenuModel.findById(menuId);
 
    if (!menu) return null;

    // Update order for each item
    updates.forEach(update => {
      const item = this.findMenuItemById(menu.items, update.id);

      if (item) {
        item.order = update.order;
      }
    });

    // Sort items by order
    this.sortMenuItems(menu.items);
    return await menu.save();
  }

  // Helper methods
  private static findMenuItemById(items: IDynamicMenuItem[], id: number): IDynamicMenuItem | null {
    for (const item of items) {
  
      // console.log('item.id === id', item.id === id)
      if (item.id === +id) return item;
      if (item.children) {
        const found = this.findMenuItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private static removeMenuItemById(items: IDynamicMenuItem[], id: number): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].children) {
        if (this.removeMenuItemById(items[i].children!, id)) {
          return true;
        }
      }
    }
    return false;
  }

  private static sortMenuItems(items: IDynamicMenuItem[]): void {
    items.sort((a, b) => a.order - b.order);
    items.forEach(item => {
      if (item.children) {
        this.sortMenuItems(item.children);
      }
    });
  }
}
