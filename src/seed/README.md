# Content Seed Script

This directory contains seed scripts for populating the database with default data.

## Available Seed Scripts

### Admin Seed (`seedAdmin.ts`)

Seeds the database with admin users and permission system including:

- **Admin Users**: Super Admin, Manager, and Viewer accounts
- **Permissions**: All CRUD permissions for system resources
- **Roles**: Super Admin, Admin, Manager, and Viewer roles
- **Role Assignments**: Automatic role assignment to admin users

### Content Seed (`seedContent.ts`)

Seeds the content management system with default data including:

- **Logos**: Main logo, footer logo, and favicon
- **Hero Sections**: Homepage hero banners with call-to-action buttons
- **Client Logos**: Brand partner logos for the homepage
- **Footer**: Complete footer with sections, links, and contact information

## Usage

### Prerequisites

1. Make sure your MongoDB database is running
2. Set up your `.env` file with the correct `DATABASE_URL`
3. Install dependencies: `bun install`

### Running the Seed Scripts

```bash
# Seed admin users and permissions
bun run seed:admin

# Seed content data
bun run seed:content

# Seed everything (admin + content)
bun run seed:all

# Or using npm/pnpm
npm run seed:admin
npm run seed:content
npm run seed:all
```

### What the Script Does

1. **Connects** to your MongoDB database
2. **Clears** existing content data (logos, hero sections, client logos, footer)
3. **Seeds** the database with default content:
   - 3 logos (main, footer, favicon)
   - 2 hero sections with different themes
   - 5 client brand logos
   - 1 footer with 4 sections and complete contact info

### Default Data Included

#### Logos
- Main logo for header branding
- Footer logo for footer section
- Favicon for browser tabs

#### Hero Sections
- Welcome section with "Shop Now" and "Learn More" buttons
- New Collection section highlighting seasonal products

#### Client Logos
- Calvin Klein
- Gucci
- Prada
- Versace
- Zara

#### Footer Sections
- **Shop**: New Arrivals, Best Sellers, Sale, Categories
- **Customer Service**: Contact, Shipping, Returns, Size Guide, FAQ
- **Company**: About Us, Careers, Press, Sustainability
- **Legal**: Privacy Policy, Terms of Service, Cookie Policy, Accessibility

#### Contact Information
- Email: support@ecommercestore.com
- Phone: +1 (555) 123-4567
- Address: 123 Fashion Street, New York, NY 10001
- Social Media: Facebook, Twitter, Instagram, GitHub

## Customization

You can modify the default data by editing the arrays in `seedContent.ts`:

- `defaultLogos`: Add or modify logo entries
- `defaultHeroSections`: Customize hero section content
- `defaultClientLogos`: Add more brand partners
- `defaultFooter`: Modify footer sections and contact info

## Safety Features

- The script clears existing data before seeding
- Uses transactions for data integrity
- Provides detailed console output for monitoring
- Gracefully handles errors and closes connections

## Environment Variables

Make sure your `.env` file contains:

```env
DATABASE_URL=mongodb://localhost:27017/ecommerce
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **Permission Errors**
   - Make sure you have write access to the database
   - Check if the database user has proper permissions

3. **TypeScript Errors**
   - Run `bun install` to ensure all dependencies are installed
   - Check that TypeScript configuration is correct

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all required environment variables are set
4. Check that the content models are properly defined

## Development

To add new seed data:

1. Add your data to the appropriate array in `seedContent.ts`
2. Create a new seed function if needed
3. Add the function to the main `seedContent()` function
4. Test the script to ensure it works correctly

## Production Considerations

- **Never run seed scripts in production** without careful consideration
- Always backup your database before running seed scripts
- Consider using environment-specific seed data
- Test thoroughly in staging environments first
