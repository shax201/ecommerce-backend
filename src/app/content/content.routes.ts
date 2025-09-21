import { Router } from 'express';
import { 
  LogoController, 
  HeroSectionController, 
  ClientLogoController, 
  FooterController,
  NavbarController,
  DynamicMenuController
} from './content.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import {
  createLogoValidation,
  updateLogoValidation,
  getLogosValidation,
  idValidation,
  createHeroSectionValidation,
  updateHeroSectionValidation,
  getHeroSectionsValidation,
  createClientLogoValidation,
  updateClientLogoValidation,
  getClientLogosValidation,
  createFooterSectionValidation,
  updateFooterSectionValidation,
  createFooterLinkValidation,
  updateFooterLinkValidation,
  updateContactInfoValidation,
  updateFooterValidation,
  footerLinkIdValidation,
  createNavbarValidation,
  updateNavbarValidation,
  createNavbarMenuValidation,
  updateNavbarMenuValidation,
  createNavbarMenuItemValidation,
  updateNavbarMenuItemValidation,
  navbarMenuIdValidation,
  navbarMenuItemIdValidation,
  reorderNavbarMenusValidation,
  reorderNavbarMenuItemsValidation
} from './content.validation';
import {
  createDynamicMenuValidation,
  updateDynamicMenuValidation,
  getDynamicMenusValidation,
  createDynamicMenuItemValidation,
  updateDynamicMenuItemValidation,
  reorderDynamicMenuItemsValidation
} from './dynamic-menu.validation';

const router = Router();

// Logo Routes
router.post('/logos', 
  authMiddleware, 
  requirePermission('content', 'create'), 
  createLogoValidation, 
  LogoController.createLogo
);
router.get('/logos', 
  // authMiddleware, 
  // requirePermission('content', 'read'), 
  getLogosValidation, 
  LogoController.getLogos
);
router.get('/logos/active/:type', LogoController.getActiveLogosByType); // Public route
router.get('/logos/:id', 
  // authMiddleware, 
  // requirePermission('content', 'read'), 
  idValidation, 
  LogoController.getLogoById
);
router.put('/logos/:id', 
  authMiddleware, 
  requirePermission('content', 'update'), 
  updateLogoValidation, 
  LogoController.updateLogo
);
router.delete('/logos/:id', 
  authMiddleware, 
  requirePermission('content', 'delete'), 
  idValidation, 
  LogoController.deleteLogo
);

// Hero Section Routes
router.post('/hero-sections', 
  authMiddleware, 
  requirePermission('content', 'create'), 
  createHeroSectionValidation, 
  HeroSectionController.createHeroSection
);
router.get('/hero-sections', 
  // authMiddleware, 
  // requirePermission('content', 'read'), 
  getHeroSectionsValidation, 
  HeroSectionController.getHeroSections
);
router.get('/hero-sections/active', HeroSectionController.getActiveHeroSections); // Public route
router.get('/hero-sections/:id', 
  // authMiddleware, 
  // requirePermission('content', 'read'), 
  idValidation, 
  HeroSectionController.getHeroSectionById
);
router.put('/hero-sections/:id', 
  authMiddleware, 
  requirePermission('content', 'update'), 
  updateHeroSectionValidation, 
  HeroSectionController.updateHeroSection
);
router.delete('/hero-sections/:id', 
  authMiddleware, 
  requirePermission('content', 'delete'), 
  idValidation, 
  HeroSectionController.deleteHeroSection
);
router.put('/hero-sections/reorder', 
  authMiddleware, 
  requirePermission('content', 'update'), 
  HeroSectionController.reorderHeroSections
);

// Client Logo Routes
router.post('/client-logos', 
  authMiddleware, 
  requirePermission('content', 'create'), 
  createClientLogoValidation, 
  ClientLogoController.createClientLogo
);
router.get('/client-logos', 
  // authMiddleware, 
  // requirePermission('content', 'read'), 
  getClientLogosValidation, 
  ClientLogoController.getClientLogos
);
router.get('/client-logos/active', ClientLogoController.getActiveClientLogos); // Public route
router.get('/client-logos/:id', 
  authMiddleware, 
  // requirePermission('content', 'read'), 
  idValidation, 
  ClientLogoController.getClientLogoById
);
router.put('/client-logos/:id', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateClientLogoValidation, 
  ClientLogoController.updateClientLogo
);
router.delete('/client-logos/:id', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  idValidation, 
  ClientLogoController.deleteClientLogo
);
router.put('/client-logos/reorder', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  ClientLogoController.reorderClientLogos
);

// Footer Routes
router.get('/footer', FooterController.getFooter); // Public route
router.put('/footer', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateFooterValidation, 
  FooterController.updateFooter
);
router.put('/footer/contact-info', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateContactInfoValidation, 
  FooterController.updateContactInfo
);

// Footer Section Routes
router.post('/footer/sections', 
  authMiddleware, 
  // requirePermission('content', 'create'), 
  createFooterSectionValidation, 
  FooterController.addFooterSection
);
router.put('/footer/sections/:id', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateFooterSectionValidation, 
  FooterController.updateFooterSection
);
router.delete('/footer/sections/:id', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  idValidation, 
  FooterController.deleteFooterSection
);

// Footer Link Routes
router.post('/footer/sections/:sectionId/links', 
  authMiddleware, 
  requirePermission('content', 'create'), 
  createFooterLinkValidation, 
  FooterController.addFooterLink
);
router.put('/footer/sections/:sectionId/links/:linkId', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateFooterLinkValidation, 
  FooterController.updateFooterLink
);
router.delete('/footer/sections/:sectionId/links/:linkId', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  footerLinkIdValidation, 
  FooterController.deleteFooterLink
);

// Navbar Routes
router.get('/navbar', NavbarController.getNavbar); // Public route
router.put('/navbar', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateNavbarValidation, 
  NavbarController.updateNavbar
);

// Navbar Menu Routes
router.post('/navbar/menus', 
  authMiddleware, 
  // requirePermission('content', 'create'), 
  createNavbarMenuValidation, 
  NavbarController.addNavbarMenu
);
router.put('/navbar/menus/:menuId', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateNavbarMenuValidation, 
  NavbarController.updateNavbarMenu
);
router.delete('/navbar/menus/:menuId', 
  authMiddleware, 
  //  requirePermission('content', 'delete'), 
  navbarMenuIdValidation, 
  NavbarController.deleteNavbarMenu
);
router.put('/navbar/menus/reorder', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  reorderNavbarMenusValidation, 
  NavbarController.reorderNavbarMenus
);

// Navbar Menu Item Routes
router.post('/navbar/menus/:menuId/items', 
  authMiddleware, 
  // requirePermission('content', 'create'), 
  createNavbarMenuItemValidation, 
  NavbarController.addNavbarMenuItem
);
router.put('/navbar/menus/:menuId/items/:menuItemId', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateNavbarMenuItemValidation, 
  NavbarController.updateNavbarMenuItem
);
router.delete('/navbar/menus/:menuId/items/:menuItemId', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  navbarMenuItemIdValidation, 
  NavbarController.deleteNavbarMenuItem
);
router.put('/navbar/menus/:menuId/items/reorder', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  reorderNavbarMenuItemsValidation, 
  NavbarController.reorderNavbarMenuItems
);

// Dynamic Menu Routes
router.post('/dynamic-menus', 
  authMiddleware, 
  // requirePermission('content', 'create'), 
  createDynamicMenuValidation, 
  DynamicMenuController.createDynamicMenu
);
router.get('/dynamic-menus', 
  authMiddleware, 
  // requirePermission('content', 'read'), 
  getDynamicMenusValidation, 
  DynamicMenuController.getDynamicMenus
);
router.get('/dynamic-menus/slug/:slug', DynamicMenuController.getDynamicMenuBySlug); // Public route
router.get('/dynamic-menus/:id', 
  authMiddleware, 
  // requirePermission('content', 'read'), 
  idValidation, 
  DynamicMenuController.getDynamicMenuById
);
router.put('/dynamic-menus/:id', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  updateDynamicMenuValidation, 
  DynamicMenuController.updateDynamicMenu
);
router.delete('/dynamic-menus/:id', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  idValidation, 
  DynamicMenuController.deleteDynamicMenu
);

// Dynamic Menu Item Routes
router.post('/dynamic-menus/:menuId/items', 
  authMiddleware, 
  // requirePermission('content', 'create'), 
  createDynamicMenuItemValidation, 
  DynamicMenuController.createDynamicMenuItem
);
router.put('/dynamic-menus/:menuId/items/:itemId', 
  authMiddleware, 
  //      requirePermission('content', 'update'), 
  updateDynamicMenuItemValidation, 
  DynamicMenuController.updateDynamicMenuItem
);
router.delete('/dynamic-menus/:menuId/items/:itemId', 
  authMiddleware, 
  // requirePermission('content', 'delete'), 
  DynamicMenuController.deleteDynamicMenuItem
);
router.patch('/dynamic-menus/:menuId/items/reorder', 
  authMiddleware, 
  // requirePermission('content', 'update'), 
  reorderDynamicMenuItemsValidation, 
  DynamicMenuController.reorderDynamicMenuItems
);

export { router as ContentRoutes };
