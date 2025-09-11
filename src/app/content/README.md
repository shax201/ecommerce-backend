# Content Management API

This module provides comprehensive content management functionality for the ecommerce platform, including logo management, hero sections, client logos, and footer content.

## API Endpoints

All content management endpoints are prefixed with `/api/v1/content`

### Logo Management

#### Create Logo
- **POST** `/api/v1/content/logos`
- **Body:**
  ```json
  {
    "name": "Main Logo",
    "description": "Primary company logo",
    "url": "https://example.com/logo.png",
    "altText": "Company Logo",
    "type": "main",
    "isActive": true
  }
  ```

#### Get Logos
- **GET** `/api/v1/content/logos`
- **Query Parameters:**
  - `type` (optional): Filter by type (main, footer, favicon)
  - `isActive` (optional): Filter by active status (true/false)
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of items per page

#### Get Active Logos by Type
- **GET** `/api/v1/content/logos/active/{type}`
- **Path Parameters:**
  - `type`: Logo type (main, footer, favicon)

#### Get Logo by ID
- **GET** `/api/v1/content/logos/{id}`

#### Update Logo
- **PUT** `/api/v1/content/logos/{id}`
- **Body:** Same as create, all fields optional

#### Delete Logo
- **DELETE** `/api/v1/content/logos/{id}`

### Hero Section Management

#### Create Hero Section
- **POST** `/api/v1/content/hero-sections`
- **Body:**
  ```json
  {
    "title": "Welcome to Our Store",
    "subtitle": "Discover Amazing Products",
    "description": "Find the best deals on fashion, electronics, and more.",
    "primaryButtonText": "Shop Now",
    "primaryButtonLink": "/shop",
    "secondaryButtonText": "Learn More",
    "secondaryButtonLink": "/about",
    "backgroundImage": "https://example.com/hero-bg.jpg",
    "backgroundImageAlt": "Hero background",
    "isActive": true,
    "order": 1
  }
  ```

#### Get Hero Sections
- **GET** `/api/v1/content/hero-sections`
- **Query Parameters:**
  - `isActive` (optional): Filter by active status
  - `page` (optional): Page number
  - `limit` (optional): Items per page

#### Get Active Hero Sections
- **GET** `/api/v1/content/hero-sections/active`

#### Get Hero Section by ID
- **GET** `/api/v1/content/hero-sections/{id}`

#### Update Hero Section
- **PUT** `/api/v1/content/hero-sections/{id}`

#### Delete Hero Section
- **DELETE** `/api/v1/content/hero-sections/{id}`

#### Reorder Hero Sections
- **PUT** `/api/v1/content/hero-sections/reorder`
- **Body:**
  ```json
  {
    "updates": [
      { "id": "hero1", "order": 1 },
      { "id": "hero2", "order": 2 }
    ]
  }
  ```

### Client Logo Management

#### Create Client Logo
- **POST** `/api/v1/content/client-logos`
- **Body:**
  ```json
  {
    "name": "Brand Partner",
    "description": "Our trusted brand partner",
    "logoUrl": "https://example.com/partner-logo.png",
    "websiteUrl": "https://partner.com",
    "altText": "Partner Logo",
    "isActive": true,
    "order": 1
  }
  ```

#### Get Client Logos
- **GET** `/api/v1/content/client-logos`
- **Query Parameters:** Same as hero sections

#### Get Active Client Logos
- **GET** `/api/v1/content/client-logos/active`

#### Get Client Logo by ID
- **GET** `/api/v1/content/client-logos/{id}`

#### Update Client Logo
- **PUT** `/api/v1/content/client-logos/{id}`

#### Delete Client Logo
- **DELETE** `/api/v1/content/client-logos/{id}`

#### Reorder Client Logos
- **PUT** `/api/v1/content/client-logos/reorder`
- **Body:** Same format as hero sections reorder

### Footer Management

#### Get Footer
- **GET** `/api/v1/content/footer`

#### Update Footer
- **PUT** `/api/v1/content/footer`
- **Body:**
  ```json
  {
    "copyright": "© 2024 Your Company. All rights reserved.",
    "description": "Your company description here.",
    "logoUrl": "https://example.com/footer-logo.png",
    "logoAlt": "Footer Logo"
  }
  ```

#### Update Contact Information
- **PUT** `/api/v1/content/footer/contact-info`
- **Body:**
  ```json
  {
    "email": "support@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main Street, City, State 12345",
    "socialMedia": {
      "facebook": "https://facebook.com/yourpage",
      "twitter": "https://twitter.com/yourpage",
      "instagram": "https://instagram.com/yourpage",
      "github": "https://github.com/yourpage"
    }
  }
  ```

### Footer Section Management

#### Add Footer Section
- **POST** `/api/v1/content/footer/sections`
- **Body:**
  ```json
  {
    "title": "Company",
    "isActive": true,
    "order": 1
  }
  ```

#### Update Footer Section
- **PUT** `/api/v1/content/footer/sections/{sectionId}`

#### Delete Footer Section
- **DELETE** `/api/v1/content/footer/sections/{sectionId}`

### Footer Link Management

#### Add Footer Link
- **POST** `/api/v1/content/footer/sections/{sectionId}/links`
- **Body:**
  ```json
  {
    "title": "About Us",
    "url": "/about",
    "isExternal": false,
    "isActive": true,
    "order": 1
  }
  ```

#### Update Footer Link
- **PUT** `/api/v1/content/footer/sections/{sectionId}/links/{linkId}`

#### Delete Footer Link
- **DELETE** `/api/v1/content/footer/sections/{sectionId}/links/{linkId}`

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "pagination": {
    "total": number,
    "page": number,
    "totalPages": number
  }
}
```

## Error Handling

- **400 Bad Request**: Validation errors or invalid input
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Error responses include:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Data Models

### Logo
- `name`: Logo name (required)
- `description`: Logo description (optional)
- `url`: Logo image URL (required)
- `altText`: Alt text for accessibility (required)
- `type`: Logo type - main, footer, or favicon (required)
- `isActive`: Whether logo is active (default: true)

### Hero Section
- `title`: Hero title (required)
- `subtitle`: Hero subtitle (optional)
- `description`: Hero description (optional)
- `primaryButtonText`: Primary button text (optional)
- `primaryButtonLink`: Primary button link (optional)
- `secondaryButtonText`: Secondary button text (optional)
- `secondaryButtonLink`: Secondary button link (optional)
- `backgroundImage`: Background image URL (optional)
- `backgroundImageAlt`: Background image alt text (optional)
- `isActive`: Whether section is active (default: true)
- `order`: Display order (auto-generated if not provided)

### Client Logo
- `name`: Client/partner name (required)
- `description`: Logo description (optional)
- `logoUrl`: Logo image URL (required)
- `websiteUrl`: Client website URL (optional)
- `altText`: Alt text for accessibility (required)
- `isActive`: Whether logo is active (default: true)
- `order`: Display order (auto-generated if not provided)

### Footer
- `sections`: Array of footer sections
- `contactInfo`: Contact information object
- `copyright`: Copyright text
- `description`: Footer description
- `logoUrl`: Footer logo URL
- `logoAlt`: Footer logo alt text

### Footer Section
- `title`: Section title (required)
- `links`: Array of footer links
- `isActive`: Whether section is active (default: true)
- `order`: Display order (auto-generated if not provided)

### Footer Link
- `title`: Link title (required)
- `url`: Link URL (required)
- `isExternal`: Whether link is external (default: false)
- `isActive`: Whether link is active (default: true)
- `order`: Display order (auto-generated if not provided)

## Usage Examples

### Frontend Integration

```typescript
// Fetch active hero sections
const response = await fetch('/api/v1/content/hero-sections/active');
const { data: heroSections } = await response.json();

// Create a new logo
const logoData = {
  name: 'Main Logo',
  url: 'https://example.com/logo.png',
  altText: 'Company Logo',
  type: 'main'
};

const response = await fetch('/api/v1/content/logos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logoData)
});
```

This content management system provides a complete solution for managing all website content through a RESTful API, with proper validation, error handling, and pagination support.
