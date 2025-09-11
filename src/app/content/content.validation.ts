import { body, param, query } from 'express-validator';

// Logo validation
export const createLogoValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('URL must be a valid URL'),
  
  body('altText')
    .notEmpty()
    .withMessage('Alt text is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Alt text must be between 1 and 200 characters'),
  
  body('type')
    .isIn(['main', 'footer', 'favicon'])
    .withMessage('Type must be one of: main, footer, favicon'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const updateLogoValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid logo ID'),
  
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('url')
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL'),
  
  body('altText')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Alt text must be between 1 and 200 characters'),
  
  body('type')
    .optional()
    .isIn(['main', 'footer', 'favicon'])
    .withMessage('Type must be one of: main, footer, favicon'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Hero Section validation
export const createHeroSectionValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('subtitle')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Subtitle must be less than 200 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('primaryButtonText')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Primary button text must be less than 50 characters'),
  
  body('primaryButtonLink')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Primary button link must be less than 500 characters'),
  
  body('secondaryButtonText')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Secondary button text must be less than 50 characters'),
  
  body('secondaryButtonLink')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Secondary button link must be less than 500 characters'),
  
  body('backgroundImage')
    .optional()
    .isURL()
    .withMessage('Background image must be a valid URL'),
  
  body('backgroundImageAlt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Background image alt text must be less than 200 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateHeroSectionValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid hero section ID'),
  
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('subtitle')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Subtitle must be less than 200 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('primaryButtonText')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Primary button text must be less than 50 characters'),
  
  body('primaryButtonLink')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Primary button link must be less than 500 characters'),
  
  body('secondaryButtonText')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Secondary button text must be less than 50 characters'),
  
  body('secondaryButtonLink')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Secondary button link must be less than 500 characters'),
  
  body('backgroundImage')
    .optional()
    .isURL()
    .withMessage('Background image must be a valid URL'),
  
  body('backgroundImageAlt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Background image alt text must be less than 200 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

// Client Logo validation
export const createClientLogoValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('logoUrl')
    .notEmpty()
    .withMessage('Logo URL is required')
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  
  body('websiteUrl')
    .optional()
    .isURL()
    .withMessage('Website URL must be a valid URL'),
  
  body('altText')
    .notEmpty()
    .withMessage('Alt text is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Alt text must be between 1 and 200 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateClientLogoValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client logo ID'),
  
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  
  body('websiteUrl')
    .optional()
    .isURL()
    .withMessage('Website URL must be a valid URL'),
  
  body('altText')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Alt text must be between 1 and 200 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

// Footer Section validation
export const createFooterSectionValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateFooterSectionValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid footer section ID'),
  
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

// Footer Link validation
export const createFooterLinkValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isLength({ max: 500 })
    .withMessage('URL must be less than 500 characters')
    .custom((value) => {
      if (!value) return false; // Required field
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('URL must be a valid URL');
      }
    }),
  
  body('isExternal')
    .optional()
    .isBoolean()
    .withMessage('isExternal must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateFooterLinkValidation = [
  param('sectionId')
    .isMongoId()
    .withMessage('Invalid footer section ID format'),
  
  param('linkId')
    .isMongoId()
    .withMessage('Invalid footer link ID format'),
  
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('url')
    .optional()
    .isLength({ max: 500 })
    .withMessage('URL must be less than 500 characters')
    .custom((value) => {
      if (!value) return true; // Allow empty values since it's optional
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('URL must be a valid URL');
      }
    }),
  
  body('isExternal')
    .optional()
    .isBoolean()
    .withMessage('isExternal must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

// Contact Info validation
export const updateContactInfoValidation = [
  body('email')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Use a simple email regex for validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        throw new Error('Email must be a valid email address');
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      if (value.trim().length < 1 || value.trim().length > 50) {
        throw new Error('Phone must be between 1 and 50 characters');
      }
      return true;
    }),
  
  body('address')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      if (value.trim().length < 1 || value.trim().length > 500) {
        throw new Error('Address must be between 1 and 500 characters');
      }
      return true;
    }),
  
  body('socialMedia.facebook')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('Facebook URL must be a valid URL');
      }
    }),
  
  body('socialMedia.twitter')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('Twitter URL must be a valid URL');
      }
    }),
  
  body('socialMedia.instagram')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('Instagram URL must be a valid URL');
      }
    }),
  
  body('socialMedia.github')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('GitHub URL must be a valid URL');
      }
    })
];

// Footer validation
export const updateFooterValidation = [
  body('copyright')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      if (value.trim().length < 1 || value.trim().length > 200) {
        throw new Error('Copyright must be between 1 and 200 characters');
      }
      return true;
    }),
  
  body('description')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      if (value.trim().length < 1 || value.trim().length > 1000) {
        throw new Error('Description must be between 1 and 1000 characters');
      }
      return true;
    }),
  
  body('logoUrl')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      
      // Clean the URL first
      let cleanUrl = value.trim();
      
      // Fix URLs with multiple slashes after protocol (e.g., https:///shop -> https://shop)
      if (cleanUrl.includes(':///')) {
        cleanUrl = cleanUrl.replace(/:\/\/\//g, '://');
      }
      
      // Ensure URL has a protocol
      const urlWithProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
        ? cleanUrl 
        : `https://${cleanUrl}`;
      
      try {
        new URL(urlWithProtocol);
        return true;
      } catch {
        throw new Error('Logo URL must be a valid URL');
      }
    }),
  
  body('logoAlt')
    .optional()
    .custom((value) => {
      if (!value || value.trim() === '') return true; // Allow empty values
      if (value.trim().length < 1 || value.trim().length > 200) {
        throw new Error('Logo alt text must be between 1 and 200 characters');
      }
      return true;
    })
];

// Common validation for ID parameters
export const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Footer link validation for sectionId and linkId parameters
export const footerLinkIdValidation = [
  param('sectionId')
    .isMongoId()
    .withMessage('Invalid footer section ID format'),
  param('linkId')
    .isMongoId()
    .withMessage('Invalid footer link ID format')
];

// Query validation for pagination and filtering
export const getLogosValidation = [
  query('type')
    .optional()
    .isIn(['main', 'footer', 'favicon'])
    .withMessage('Type must be one of: main, footer, favicon'),
  
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const getHeroSectionsValidation = [
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const getClientLogosValidation = [
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Navbar validation
export const createNavbarMenuItemValidation = [
  body('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  body('label')
    .notEmpty()
    .withMessage('Label is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Label must be between 1 and 100 characters'),
  
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('URL must be between 1 and 500 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateNavbarMenuItemValidation = [
  param('menuId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu ID'),
  
  param('menuItemId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu item ID'),
  
  body('label')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Label must be between 1 and 100 characters'),
  
  body('url')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('URL must be between 1 and 500 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const createNavbarMenuValidation = [
  body('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  body('label')
    .notEmpty()
    .withMessage('Label is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Label must be between 1 and 100 characters'),
  
  body('type')
    .isIn(['MenuItem', 'MenuList'])
    .withMessage('Type must be either MenuItem or MenuList'),
  
  body('url')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('URL must be between 1 and 500 characters'),
  
  body('children')
    .optional()
    .isArray()
    .withMessage('Children must be an array'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const updateNavbarMenuValidation = [
  param('menuId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu ID'),
  
  body('label')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Label must be between 1 and 100 characters'),
  
  body('type')
    .optional()
    .isIn(['MenuItem', 'MenuList'])
    .withMessage('Type must be either MenuItem or MenuList'),
  
  body('url')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('URL must be between 1 and 500 characters'),
  
  body('children')
    .optional()
    .isArray()
    .withMessage('Children must be an array'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];

export const createNavbarValidation = [
  body('menus')
    .isArray({ min: 1 })
    .withMessage('Menus must be a non-empty array'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const updateNavbarValidation = [
  body('menus')
    .optional()
    .isArray()
    .withMessage('Menus must be an array'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const navbarMenuIdValidation = [
  param('menuId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu ID')
];

export const navbarMenuItemIdValidation = [
  param('menuId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu ID'),
  
  param('menuItemId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu item ID')
];

export const reorderNavbarMenusValidation = [
  body('updates')
    .isArray({ min: 1 })
    .withMessage('Updates must be a non-empty array'),
  
  body('updates.*.id')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid ID'),
  
  body('updates.*.order')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid order')
];

export const reorderNavbarMenuItemsValidation = [
  param('menuId')
    .isInt({ min: 1 })
    .withMessage('Invalid menu ID'),
  
  body('updates')
    .isArray({ min: 1 })
    .withMessage('Updates must be a non-empty array'),
  
  body('updates.*.id')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid ID'),
  
  body('updates.*.order')
    .isInt({ min: 1 })
    .withMessage('Each update must have a valid order')
];