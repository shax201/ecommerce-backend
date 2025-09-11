import { Request, Response } from 'express';
import { LogoService, HeroSectionService, ClientLogoService, FooterService, NavbarService, DynamicMenuService } from './content.service';
import { validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log('errors', errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  return null;
};

// Helper function to handle errors
const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Logo Controllers
export class LogoController {
  static async createLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const logo = await LogoService.createLogo(req.body);
      res.status(201).json({
        success: true,
        message: 'Logo created successfully',
        data: logo
      });
    } catch (error) {
      handleError(res, error, 'Error creating logo:');
    }
  }

  static async getLogos(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { type, isActive, page, limit } = req.query;
      const filters: any = {};
      
      if (type) filters.type = type;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await LogoService.getLogos(filters);
      res.status(200).json({
        success: true,
        message: 'Logos retrieved successfully',
        data: result.logos,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving logos:');
    }
  }

  static async getLogoById(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const logo = await LogoService.getLogoById(id);
      
      if (!logo) {
        return res.status(404).json({
          success: false,
          message: 'Logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logo retrieved successfully',
        data: logo
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving logo:');
    }
  }

  static async updateLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const logo = await LogoService.updateLogo(id, req.body);
      
      if (!logo) {
        return res.status(404).json({
          success: false,
          message: 'Logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logo updated successfully',
        data: logo
      });
    } catch (error) {
      handleError(res, error, 'Error updating logo:');
    }
  }

  static async deleteLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const deleted = await LogoService.deleteLogo(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logo deleted successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error deleting logo:');
    }
  }

  static async getActiveLogosByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const logos = await LogoService.getActiveLogosByType(type);
      

      res.status(200).json({
        success: true,
        message: 'Active logos retrieved successfully',
        data: logos[0]
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving active logos:');
    }
  }
}

// Hero Section Controllers
export class HeroSectionController {
  static async createHeroSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const heroSection = await HeroSectionService.createHeroSection(req.body);
      res.status(201).json({
        success: true,
        message: 'Hero section created successfully',
        data: heroSection
      });
    } catch (error) {
      handleError(res, error, 'Error creating hero section:');
    }
  }

  static async getHeroSections(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { isActive, page, limit } = req.query;
      const filters: any = {};
      
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await HeroSectionService.getHeroSections(filters);
      res.status(200).json({
        success: true,
        message: 'Hero sections retrieved successfully',
        data: result.heroSections,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving hero sections:');
    }
  }

  static async getHeroSectionById(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const heroSection = await HeroSectionService.getHeroSectionById(id);
      
      if (!heroSection) {
        return res.status(404).json({
          success: false,
          message: 'Hero section not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hero section retrieved successfully',
        data: heroSection
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving hero section:');
    }
  }

  static async updateHeroSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const heroSection = await HeroSectionService.updateHeroSection(id, req.body);
      
      if (!heroSection) {
        return res.status(404).json({
          success: false,
          message: 'Hero section not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hero section updated successfully',
        data: heroSection
      });
    } catch (error) {
      handleError(res, error, 'Error updating hero section:');
    }
  }

  static async deleteHeroSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const deleted = await HeroSectionService.deleteHeroSection(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Hero section not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hero section deleted successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error deleting hero section:');
    }
  }

  static async getActiveHeroSections(req: Request, res: Response) {
    try {
      const heroSections = await HeroSectionService.getActiveHeroSections();
      
      res.status(200).json({
        success: true,
        message: 'Active hero sections retrieved successfully',
        data: heroSections
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving active hero sections:');
    }
  }

  static async reorderHeroSections(req: Request, res: Response) {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates must be an array'
        });
      }

      await HeroSectionService.reorderHeroSections(updates);
      
      res.status(200).json({
        success: true,
        message: 'Hero sections reordered successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error reordering hero sections:');
    }
  }
}

// Client Logo Controllers
export class ClientLogoController {
  static async createClientLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const clientLogo = await ClientLogoService.createClientLogo(req.body);
      res.status(201).json({
        success: true,
        message: 'Client logo created successfully',
        data: clientLogo
      });
    } catch (error) {
      handleError(res, error, 'Error creating client logo:');
    }
  }

  static async getClientLogos(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { isActive, page, limit } = req.query;
      const filters: any = {};
      
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await ClientLogoService.getClientLogos(filters);
      res.status(200).json({
        success: true,
        message: 'Client logos retrieved successfully',
        data: result.clientLogos,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving client logos:');
    }
  }

  static async getClientLogoById(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const clientLogo = await ClientLogoService.getClientLogoById(id);
      
      if (!clientLogo) {
        return res.status(404).json({
          success: false,
          message: 'Client logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Client logo retrieved successfully',
        data: clientLogo
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving client logo:');
    }
  }

  static async updateClientLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const clientLogo = await ClientLogoService.updateClientLogo(id, req.body);
      
      if (!clientLogo) {
        return res.status(404).json({
          success: false,
          message: 'Client logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Client logo updated successfully',
        data: clientLogo
      });
    } catch (error) {
      handleError(res, error, 'Error updating client logo:');
    }
  }

  static async deleteClientLogo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const deleted = await ClientLogoService.deleteClientLogo(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Client logo not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Client logo deleted successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error deleting client logo:');
    }
  }

  static async getActiveClientLogos(req: Request, res: Response) {
    try {
      const clientLogos = await ClientLogoService.getActiveClientLogos();
      
      res.status(200).json({
        success: true,
        message: 'Active client logos retrieved successfully',
        data: clientLogos
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving active client logos:');
    }
  }

  static async reorderClientLogos(req: Request, res: Response) {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates must be an array'
        });
      }

      await ClientLogoService.reorderClientLogos(updates);
      
      res.status(200).json({
        success: true,
        message: 'Client logos reordered successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error reordering client logos:');
    }
  }
}

// Footer Controllers
export class FooterController {
  static async getFooter(req: Request, res: Response) {
    try {
      const footer = await FooterService.getFooter();
      
      res.status(200).json({
        success: true,
        message: 'Footer retrieved successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving footer:');
    }
  }

  static async updateFooter(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const footer = await FooterService.updateFooter(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Footer updated successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error updating footer:');
    }
  }

  static async updateContactInfo(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const footer = await FooterService.updateContactInfo(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Contact information updated successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error updating contact information:');
    }
  }

  static async addFooterSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const footer = await FooterService.addFooterSection(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Footer section added successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error adding footer section:');
    }
  }

  static async updateFooterSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id: sectionId } = req.params;
      const footer = await FooterService.updateFooterSection(sectionId, req.body);
      
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: 'Footer section not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Footer section updated successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error updating footer section:');
    }
  }

  static async deleteFooterSection(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id: sectionId } = req.params;
      const footer = await FooterService.deleteFooterSection(sectionId);
      
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: 'Footer section not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Footer section deleted successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error deleting footer section:');
    }
  }

  static async addFooterLink(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { sectionId } = req.params;
      const footer = await FooterService.addFooterLink(sectionId, req.body);
      
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: 'Footer section not found'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Footer link added successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error adding footer link:');
    }
  }

  static async updateFooterLink(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { sectionId, linkId } = req.params;
      const footer = await FooterService.updateFooterLink(sectionId, linkId, req.body);
      
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: 'Footer section or link not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Footer link updated successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error updating footer link:');
    }
  }

  static async deleteFooterLink(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { sectionId, linkId } = req.params;
      const footer = await FooterService.deleteFooterLink(sectionId, linkId);
      
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: 'Footer section or link not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Footer link deleted successfully',
        data: footer
      });
    } catch (error) {
      handleError(res, error, 'Error deleting footer link:');
    }
  }
}

// Navbar Controllers
export class NavbarController {
  static async getNavbar(req: Request, res: Response) {
    try {
      const navbar = await NavbarService.getNavbar();
      
      res.status(200).json({
        success: true,
        message: 'Navbar retrieved successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving navbar:');
    }
  }

  static async updateNavbar(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const navbar = await NavbarService.updateNavbar(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Navbar updated successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error updating navbar:');
    }
  }

  static async addNavbarMenu(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const navbar = await NavbarService.addNavbarMenu(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Navbar menu added successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error adding navbar menu:');
    }
  }

  static async updateNavbarMenu(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId } = req.params;
      const navbar = await NavbarService.updateNavbarMenu(parseInt(menuId), req.body);
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menu updated successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error updating navbar menu:');
    }
  }

  static async deleteNavbarMenu(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const navbar = await NavbarService.deleteNavbarMenu(parseInt(menuId));
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menu deleted successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error deleting navbar menu:');
    }
  }

  static async addNavbarMenuItem(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId } = req.params;
      const navbar = await NavbarService.addNavbarMenuItem(parseInt(menuId), req.body);
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu not found or not a MenuList type'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Navbar menu item added successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error adding navbar menu item:');
    }
  }

  static async updateNavbarMenuItem(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId, menuItemId } = req.params;
      const navbar = await NavbarService.updateNavbarMenuItem(parseInt(menuId), parseInt(menuItemId), req.body);
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu or menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menu item updated successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error updating navbar menu item:');
    }
  }

  static async deleteNavbarMenuItem(req: Request, res: Response) {
    try {
      const { menuId, menuItemId } = req.params;
      const navbar = await NavbarService.deleteNavbarMenuItem(parseInt(menuId), parseInt(menuItemId));
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu or menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menu item deleted successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error deleting navbar menu item:');
    }
  }

  static async reorderNavbarMenus(req: Request, res: Response) {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates must be an array'
        });
      }

      const navbar = await NavbarService.reorderNavbarMenus(updates);
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menus reordered successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error reordering navbar menus:');
    }
  }

  static async reorderNavbarMenuItems(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const { updates } = req.body;
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates must be an array'
        });
      }

      const navbar = await NavbarService.reorderNavbarMenuItems(parseInt(menuId), updates);
      
      if (!navbar) {
        return res.status(404).json({
          success: false,
          message: 'Navbar menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Navbar menu items reordered successfully',
        data: navbar
      });
    } catch (error) {
      handleError(res, error, 'Error reordering navbar menu items:');
    }
  }
}

// Dynamic Menu Controllers
export class DynamicMenuController {
  static async createDynamicMenu(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const menu = await DynamicMenuService.createDynamicMenu(req.body);
      res.status(201).json({
        success: true,
        message: 'Dynamic menu created successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error creating dynamic menu:');
    }
  }

  static async getDynamicMenus(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { isActive, page, limit } = req.query;
      const filters: any = {};
      
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await DynamicMenuService.getDynamicMenus(filters);
      res.status(200).json({
        success: true,
        message: 'Dynamic menus retrieved successfully',
        data: result.menus,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving dynamic menus:');
    }
  }

  static async getDynamicMenuById(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const menu = await DynamicMenuService.getDynamicMenuById(id);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu retrieved successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving dynamic menu:');
    }
  }

  static async getDynamicMenuBySlug(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { slug } = req.params;
      const menu = await DynamicMenuService.getDynamicMenuBySlug(slug);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu retrieved successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error retrieving dynamic menu:');
    }
  }

  static async updateDynamicMenu(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const menu = await DynamicMenuService.updateDynamicMenu(id, req.body);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu updated successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error updating dynamic menu:');
    }
  }

  static async deleteDynamicMenu(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { id } = req.params;
      const deleted = await DynamicMenuService.deleteDynamicMenu(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu deleted successfully'
      });
    } catch (error) {
      handleError(res, error, 'Error deleting dynamic menu:');
    }
  }

  static async createDynamicMenuItem(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId } = req.params;
      const menu = await DynamicMenuService.createDynamicMenuItem(menuId, req.body);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Dynamic menu item created successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error creating dynamic menu item:');
    }
  }

  static async updateDynamicMenuItem(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId, itemId } = req.params;
      console.log('itemId controller', itemId)
      const menu = await DynamicMenuService.updateDynamicMenuItem(menuId, parseInt(itemId), req.body);
      
     
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu or menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu item updated successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error updating dynamic menu item:');
    }
  }

  static async deleteDynamicMenuItem(req: Request, res: Response) {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    try {
      const { menuId, itemId } = req.params;
      const menu = await DynamicMenuService.deleteDynamicMenuItem(menuId, parseInt(itemId));
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu or menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu item deleted successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error deleting dynamic menu item:');
    }
  }

  static async reorderDynamicMenuItems(req: Request, res: Response) {
    try {
      const { menuId } = req.params;

      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates must be an array'
        });
      }

      const menu = await DynamicMenuService.reorderDynamicMenuItems(menuId, updates[0].updates);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Dynamic menu not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Dynamic menu items reordered successfully',
        data: menu
      });
    } catch (error) {
      handleError(res, error, 'Error reordering dynamic menu items:');
    }
  }
}
