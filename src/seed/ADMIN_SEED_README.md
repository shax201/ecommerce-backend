# Admin Seeding Script

This script creates admin users with full permissions for the ecommerce application.

## What It Does

### 1. Creates Default Permissions
- All CRUD permissions for users, products, categories, orders, coupons, content, reports, company-settings, and shipping-addresses
- 36 total permissions covering all system resources

### 2. Creates Default Roles
- **Super Admin**: Full access to all permissions
- **Admin**: Most permissions (excludes some sensitive operations)
- **Manager**: Read and update permissions only
- **Viewer**: Read-only access to most resources

### 3. Creates Admin Users
- **Super Admin**: admin@ecommerce.com
- **Manager**: manager@ecommerce.com  
- **Viewer**: viewer@ecommerce.com

### 4. Assigns Roles
- Automatically assigns appropriate roles to each admin user
- Links users to their permissions through role assignments

## Usage

### Prerequisites

1. Make sure your MongoDB database is running
2. Set up your `.env` file with the correct `DATABASE_URL`
3. Install dependencies: `bun install`

### Running the Admin Seed Script

```bash
# Seed only admin users and permissions
bun run seed:admin

# Seed everything (admin + content)
bun run seed:all

# Seed only content
bun run seed:content
```

### Default Admin Credentials

After running the seed script, you'll have these admin accounts:

#### 1. Super Admin (Full Access)
- **Email**: admin@ecommerce.com
- **Password**: Admin123!@#
- **Permissions**: All system permissions
- **Use Case**: Complete system administration

#### 2. Manager (Management Access)
- **Email**: manager@ecommerce.com
- **Password**: Manager123!@#
- **Permissions**: Read and update most resources
- **Use Case**: Day-to-day management operations

#### 3. Viewer (Read-Only Access)
- **Email**: viewer@ecommerce.com
- **Password**: Viewer123!@#
- **Permissions**: Read-only access to most resources
- **Use Case**: Monitoring and reporting

## Security Features

### Password Security
- All passwords are hashed using Argon2 (industry standard)
- Default passwords are strong but should be changed immediately
- No plain text passwords are stored in the database

### Permission System
- Role-based access control (RBAC)
- Granular permissions for each resource and action
- Easy to modify permissions without code changes

### Data Integrity
- Uses database transactions for consistency
- Validates all data before insertion
- Handles duplicate prevention gracefully

## What Gets Created

### Permissions (36 total)
```
Users: create, read, update, delete
Products: create, read, update, delete
Categories: create, read, update, delete
Orders: create, read, update, delete
Coupons: create, read, update, delete
Content: create, read, update, delete
Reports: create, read, update, delete
Company Settings: create, read, update, delete
Shipping Addresses: create, read, update, delete
```

### Roles (4 total)
- **Super Admin**: 36 permissions (all)
- **Admin**: 32 permissions (most)
- **Manager**: 18 permissions (read + update)
- **Viewer**: 9 permissions (read only)

### Admin Users (3 total)
- Each with unique email and role assignment
- All with active status and proper password hashing

## Customization

### Adding New Admins
Edit the `defaultAdmins` array in `seedAdmin.ts`:

```typescript
const defaultAdmins: Partial<TAdmin>[] = [
  {
    firstName: 'Your',
    lastName: 'Name',
    email: 'your@email.com',
    password: 'YourPassword123!',
    status: true,
    image: '/images/your-avatar.png'
  },
  // ... existing admins
];
```

### Modifying Roles
The script uses the existing `PermissionService.createDefaultRoles()` method. To modify roles, edit the service method or create custom roles after seeding.

### Changing Default Passwords
Modify the `defaultAdmins` array with your preferred passwords. Remember to use strong passwords in production.

## Production Considerations

### Security Checklist
- [ ] Change all default passwords immediately
- [ ] Use environment variables for production admin credentials
- [ ] Enable two-factor authentication if possible
- [ ] Regularly audit admin permissions
- [ ] Use strong, unique passwords for each admin

### Environment Variables
For production, consider using environment variables:

```env
# Production admin credentials
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

### Database Backup
Always backup your database before running seed scripts in production:

```bash
# MongoDB backup
mongodump --db ecommerce --out backup/

# Restore if needed
mongorestore --db ecommerce backup/ecommerce/
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

3. **Duplicate Admin Error**
   - The script handles duplicates gracefully
   - Existing admins are skipped, not overwritten

4. **Role Assignment Error**
   - Ensure permissions and roles are created first
   - Check if the admin user exists

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all required environment variables are set
4. Check that the admin models are properly defined

## Development Workflow

### First Time Setup
1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables
4. Run: `bun run seed:all`
5. Start the application: `bun dev`

### Adding New Features
1. Create new permissions in the permission service
2. Update roles to include new permissions
3. Re-run the seed script to update existing data
4. Test with different admin accounts

### Testing Permissions
1. Login with different admin accounts
2. Test access to different resources
3. Verify permission restrictions work correctly
4. Use the admin panel to manage permissions

## Next Steps

After running the seed script:

1. **Start the application**:
   ```bash
   # Backend
   bun dev
   
   # Frontend (in another terminal)
   cd front-end
   bun dev
   ```

2. **Login to admin panel**:
   - Go to `/admin` or `/admin/login`
   - Use any of the provided credentials

3. **Change default passwords**:
   - Go to admin settings
   - Update passwords for all admin accounts

4. **Create additional admins**:
   - Use the admin panel to create more admin users
   - Assign appropriate roles and permissions

5. **Customize permissions**:
   - Modify role permissions as needed
   - Create custom roles for specific use cases

## Support

For questions or issues with the admin seeding:

1. Check the console output for error messages
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Check the permission service implementation

The admin seeding script is designed to be robust and handle most common scenarios automatically.
