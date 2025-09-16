import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import * as argon2 from 'argon2';
import AdminModel from '../app/user/admin/admin.model';
import { PermissionService } from '../app/permission/permission.service';
import { TAdmin } from '../app/user/admin/admin.interface';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🔧 Configuration:');
console.log(`   Database URL: ${DATABASE_URL}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('🚀 Starting admin seeding process...');

// Default admin data
const defaultAdmins: Partial<TAdmin>[] = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@ecommerce.com',
    password: 'Admin123!@#', // This will be hashed
    status: true,
    image: '/images/admin-avatar.png'
  },
  {
    firstName: 'John',
    lastName: 'Manager',
    email: 'manager@ecommerce.com',
    password: 'Manager123!@#', // This will be hashed
    status: true,
    image: '/images/manager-avatar.png'
  },
  {
    firstName: 'Jane',
    lastName: 'Viewer',
    email: 'viewer@ecommerce.com',
    password: 'Viewer123!@#', // This will be hashed
    status: true,
    image: '/images/viewer-avatar.png'
  }
];

// Function to create default permissions
async function createDefaultPermissions(): Promise<void> {
  console.log('📋 Creating default permissions...');
  
  try {
    await PermissionService.createDefaultPermissions();
    console.log('✅ Default permissions created successfully');
  } catch (error) {
    console.log('⚠️  Default permissions may already exist, continuing...');
  }
}

// Function to create default roles
async function createDefaultRoles(): Promise<void> {
  console.log('👥 Creating default roles...');
  
  try {
    await PermissionService.createDefaultRoles();
    console.log('✅ Default roles created successfully');
  } catch (error) {
    console.log('⚠️  Default roles may already exist, continuing...');
  }
}

// Function to assign roles to admins
async function assignRolesToAdmins(): Promise<void> {
  console.log('🔗 Assigning roles to admins...');
  
  try {
    // Get all roles
    const roles = await PermissionService.getAllRoles();
    console.log(`📋 Found ${roles.length} roles:`, roles.map(r => r.name));
    
    const superAdminRole = roles.find(role => role.name === 'Super Admin');
    const adminRole = roles.find(role => role.name === 'Admin');
    const managerRole = roles.find(role => role.name === 'Manager');
    const viewerRole = roles.find(role => role.name === 'Viewer');
    
    if (!superAdminRole || !adminRole || !managerRole || !viewerRole) {
      console.error('❌ Required roles not found:');
      console.error(`   Super Admin: ${!!superAdminRole}`);
      console.error(`   Admin: ${!!adminRole}`);
      console.error(`   Manager: ${!!managerRole}`);
      console.error(`   Viewer: ${!!viewerRole}`);
      throw new Error('Required roles not found');
    }
    
    // Get all admins
    const admins = await AdminModel.find();
    console.log(`👤 Found ${admins.length} admin users:`, admins.map(a => a.email));
    
    for (const admin of admins) {
      let roleToAssign;
      
      // Assign roles based on email
      if (admin.email === 'admin@ecommerce.com') {
        roleToAssign = superAdminRole;
      } else if (admin.email === 'manager@ecommerce.com') {
        roleToAssign = managerRole;
      } else if (admin.email === 'viewer@ecommerce.com') {
        roleToAssign = viewerRole;
      } else {
        // Default to admin role for other admins
        roleToAssign = adminRole;
      }
      
      console.log(`🔗 Assigning ${roleToAssign.name} role to ${admin.email}...`);
      
      try {
        const result = await PermissionService.assignRoleToUser(
          String(admin._id),
          String(roleToAssign._id),
          String(admin._id) // Self-assigned for seed data
        );
        console.log(`✅ Successfully assigned ${roleToAssign.name} role to ${admin.email}`);
        console.log(`   UserRole ID: ${result._id}`);
      } catch (error) {
        console.error(`❌ Error assigning role to ${admin.email}:`, error);
        // Don't throw here, continue with other admins
      }
    }
    
    console.log('✅ Role assignment process completed');
  } catch (error) {
    console.error('❌ Error in role assignment process:', error);
    throw error;
  }
}

// Function to create admin users
async function createAdminUsers(): Promise<void> {
  console.log('👤 Creating admin users...');
  
  for (const adminData of defaultAdmins) {
    try {
      // Check if admin already exists
      const existingAdmin = await AdminModel.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin with email ${adminData.email} already exists, skipping...`);
        continue;
      }
      
      // Hash the password
      const hashedPassword = await argon2.hash(adminData.password!);
      
      // Create admin user
      const admin = new AdminModel({
        ...adminData,
        password: hashedPassword
      });
      
      await admin.save();
      console.log(`✅ Created admin: ${adminData.firstName} ${adminData.lastName} (${adminData.email})`);
      
    } catch (error) {
      console.error(`❌ Error creating admin ${adminData.email}:`, error);
      throw error;
    }
  }
  
  console.log('✅ Admin users created successfully');
}

// Function to display admin credentials
function displayAdminCredentials(): void {
  console.log('\n🎉 Admin seeding completed successfully!');
  console.log('\n📋 Admin Credentials:');
  console.log('=====================================');
  
  defaultAdmins.forEach((admin, index) => {
    console.log(`\n${index + 1}. ${admin.firstName} ${admin.lastName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${admin.password}`);
    console.log(`   Role: ${getRoleForAdmin(admin.email!)}`);
  });
  
  console.log('\n🔐 Important Security Notes:');
  console.log('=====================================');
  console.log('• Change these passwords immediately after first login');
  console.log('• These are default credentials for development only');
  console.log('• Never use these credentials in production');
  console.log('• Consider using environment variables for production admin credentials');
  
  console.log('\n🚀 Next Steps:');
  console.log('=====================================');
  console.log('1. Start your backend server: bun dev');
  console.log('2. Start your frontend: cd front-end && bun dev');
  console.log('3. Login to the admin panel using any of the above credentials');
  console.log('4. Change the default passwords in the admin settings');
  console.log('5. Create additional admin users as needed');
}

// Helper function to get role for admin email
function getRoleForAdmin(email: string): string {
  switch (email) {
    case 'admin@ecommerce.com':
      return 'Super Admin (Full Access)';
    case 'manager@ecommerce.com':
      return 'Manager (Read/Update Access)';
    case 'viewer@ecommerce.com':
      return 'Viewer (Read Only Access)';
    default:
      return 'Admin (Most Access)';
  }
}

// Function to verify admin setup
async function verifyAdminSetup(): Promise<void> {
  console.log('\n🔍 Verifying admin setup...');
  
  try {
    // Check if admins exist
    const adminCount = await AdminModel.countDocuments();
    console.log(`✅ Found ${adminCount} admin users`);
    
    // Check if permissions exist
    const permissions = await PermissionService.getAllPermissions();
    console.log(`✅ Found ${permissions.length} permissions`);
    
    // Check if roles exist
    const roles = await PermissionService.getAllRoles();
    console.log(`✅ Found ${roles.length} roles`);
    
    // Check role assignments
    const admins = await AdminModel.find();
    console.log('\n📋 Role Assignment Verification:');
    console.log('=====================================');
    
    for (const admin of admins) {
      try {
        const userRoles = await PermissionService.getUserRoles(String(admin._id));
        console.log(`👤 ${admin.email}:`);
        console.log(`   Roles assigned: ${userRoles.length}`);
        
        if (userRoles.length > 0) {
          for (const userRole of userRoles) {
            // Check if roleId is populated (object) or just an ID (string)
            const roleName = userRole.roleId && typeof userRole.roleId === 'object' 
              ? (userRole.roleId as any).name 
              : roles.find(r => r._id?.toString() === userRole.roleId.toString())?.name;
            console.log(`   - ${roleName || 'Unknown Role'} (${userRole.isActive ? 'Active' : 'Inactive'})`);
          }
        } else {
          console.log(`   ⚠️  No roles assigned!`);
        }
        
        // Also check permissions directly
        const userPermissions = await PermissionService.getUserPermissions(String(admin._id));
        console.log(`   Permissions: ${userPermissions.length}`);
        
      } catch (error) {
        console.error(`❌ Error checking roles for ${admin.email}:`, error);
      }
    }
    
    console.log('\n✅ Admin setup verification completed');
  } catch (error) {
    console.error('❌ Error verifying admin setup:', error);
    throw error;
  }
}

// Function to force assign roles (in case they weren't assigned properly)
async function forceAssignRoles(): Promise<void> {
  console.log('\n🔧 Force assigning roles to ensure proper setup...');
  
  try {
    const roles = await PermissionService.getAllRoles();
    const admins = await AdminModel.find();
    
    for (const admin of admins) {
      // Check if admin already has roles
      const existingRoles = await PermissionService.getUserRoles(String(admin._id));
      
      if (existingRoles.length === 0) {
        console.log(`🔧 No roles found for ${admin.email}, assigning default role...`);
        
        let roleToAssign;
        if (admin.email === 'admin@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Super Admin');
        } else if (admin.email === 'manager@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Manager');
        } else if (admin.email === 'viewer@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Viewer');
        } else {
          roleToAssign = roles.find(role => role.name === 'Admin');
        }
        
        if (roleToAssign) {
          try {
            await PermissionService.assignRoleToUser(
              String(admin._id),
              String(roleToAssign._id),
              String(admin._id)
            );
            console.log(`✅ Force assigned ${roleToAssign.name} role to ${admin.email}`);
          } catch (error) {
            console.error(`❌ Error force assigning role to ${admin.email}:`, error);
          }
        }
      } else {
        console.log(`✅ ${admin.email} already has ${existingRoles.length} role(s)`);
      }
    }
  } catch (error) {
    console.error('❌ Error in force role assignment:', error);
  }
}

// Main seeding function
async function seedAdmin(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully');
    
    // Create default permissions
    await createDefaultPermissions();
    
    // Create default roles
    await createDefaultRoles();
    
    // Create admin users
    await createAdminUsers();
    
    // Assign roles to admins
    await assignRolesToAdmins();
    
    // Force assign roles if needed
    await forceAssignRoles();
    
    // Verify setup
    await verifyAdminSetup();
    
    // Display credentials
    displayAdminCredentials();
    
  } catch (error) {
    console.error('❌ Error during admin seeding:', error);
    throw error;
  } finally {
    // Close database connection
    console.log('\n🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('\n🎉 Admin seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Admin seeding process failed:', error);
      process.exit(1);
    });
}

export { seedAdmin };
