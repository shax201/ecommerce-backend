import { Router } from 'express';
import { 
  LogoController, 
  HeroSectionController, 
  ClientLogoController, 
  FooterController,
  NavbarController,
  DynamicMenuController
} from './content.controller';
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
router.post('/logos', createLogoValidation, LogoController.createLogo);
router.get('/logos', getLogosValidation, LogoController.getLogos);
router.get('/logos/active/:type', LogoController.getActiveLogosByType);
router.get('/logos/:id', idValidation, LogoController.getLogoById);
router.put('/logos/:id', updateLogoValidation, LogoController.updateLogo);
router.delete('/logos/:id', idValidation, LogoController.deleteLogo);

// Hero Section Routes
router.post('/hero-sections', createHeroSectionValidation, HeroSectionController.createHeroSection);
router.get('/hero-sections', getHeroSectionsValidation, HeroSectionController.getHeroSections);
router.get('/hero-sections/active', HeroSectionController.getActiveHeroSections);
router.get('/hero-sections/:id', idValidation, HeroSectionController.getHeroSectionById);
router.put('/hero-sections/:id', updateHeroSectionValidation, HeroSectionController.updateHeroSection);
router.delete('/hero-sections/:id', idValidation, HeroSectionController.deleteHeroSection);
router.put('/hero-sections/reorder', HeroSectionController.reorderHeroSections);

// Client Logo Routes
router.post('/client-logos', createClientLogoValidation, ClientLogoController.createClientLogo);
router.get('/client-logos', getClientLogosValidation, ClientLogoController.getClientLogos);
router.get('/client-logos/active', ClientLogoController.getActiveClientLogos);
router.get('/client-logos/:id', idValidation, ClientLogoController.getClientLogoById);
router.put('/client-logos/:id', updateClientLogoValidation, ClientLogoController.updateClientLogo);
router.delete('/client-logos/:id', idValidation, ClientLogoController.deleteClientLogo);
router.put('/client-logos/reorder', ClientLogoController.reorderClientLogos);

// Footer Routes
router.get('/footer', FooterController.getFooter);
router.put('/footer', updateFooterValidation, FooterController.updateFooter);
router.put('/footer/contact-info', updateContactInfoValidation, FooterController.updateContactInfo);

// Footer Section Routes
router.post('/footer/sections', createFooterSectionValidation, FooterController.addFooterSection);
router.put('/footer/sections/:id', updateFooterSectionValidation, FooterController.updateFooterSection);
router.delete('/footer/sections/:id', idValidation, FooterController.deleteFooterSection);

// Footer Link Routes
router.post('/footer/sections/:sectionId/links', createFooterLinkValidation, FooterController.addFooterLink);
router.put('/footer/sections/:sectionId/links/:linkId', updateFooterLinkValidation, FooterController.updateFooterLink);
router.delete('/footer/sections/:sectionId/links/:linkId', footerLinkIdValidation, FooterController.deleteFooterLink);

// Navbar Routes
router.get('/navbar', NavbarController.getNavbar);
router.put('/navbar', updateNavbarValidation, NavbarController.updateNavbar);

// Navbar Menu Routes
router.post('/navbar/menus', createNavbarMenuValidation, NavbarController.addNavbarMenu);
router.put('/navbar/menus/:menuId', updateNavbarMenuValidation, NavbarController.updateNavbarMenu);
router.delete('/navbar/menus/:menuId', navbarMenuIdValidation, NavbarController.deleteNavbarMenu);
router.put('/navbar/menus/reorder', reorderNavbarMenusValidation, NavbarController.reorderNavbarMenus);

// Navbar Menu Item Routes
router.post('/navbar/menus/:menuId/items', createNavbarMenuItemValidation, NavbarController.addNavbarMenuItem);
router.put('/navbar/menus/:menuId/items/:menuItemId', updateNavbarMenuItemValidation, NavbarController.updateNavbarMenuItem);
router.delete('/navbar/menus/:menuId/items/:menuItemId', navbarMenuItemIdValidation, NavbarController.deleteNavbarMenuItem);
router.put('/navbar/menus/:menuId/items/reorder', reorderNavbarMenuItemsValidation, NavbarController.reorderNavbarMenuItems);

// Dynamic Menu Routes
router.post('/dynamic-menus', createDynamicMenuValidation, DynamicMenuController.createDynamicMenu);
router.get('/dynamic-menus', getDynamicMenusValidation, DynamicMenuController.getDynamicMenus);
router.get('/dynamic-menus/slug/:slug', DynamicMenuController.getDynamicMenuBySlug);
router.get('/dynamic-menus/:id', idValidation, DynamicMenuController.getDynamicMenuById);
router.put('/dynamic-menus/:id', updateDynamicMenuValidation, DynamicMenuController.updateDynamicMenu);
router.delete('/dynamic-menus/:id', idValidation, DynamicMenuController.deleteDynamicMenu);

// Dynamic Menu Item Routes
router.post('/dynamic-menus/:menuId/items', createDynamicMenuItemValidation, DynamicMenuController.createDynamicMenuItem);
router.put('/dynamic-menus/:menuId/items/:itemId', updateDynamicMenuItemValidation, DynamicMenuController.updateDynamicMenuItem);
router.delete('/dynamic-menus/:menuId/items/:itemId', DynamicMenuController.deleteDynamicMenuItem);
router.patch('/dynamic-menus/:menuId/items/reorder', reorderDynamicMenuItemsValidation, DynamicMenuController.reorderDynamicMenuItems);

export { router as ContentRoutes };
