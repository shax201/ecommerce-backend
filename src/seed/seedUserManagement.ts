import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { UserManagementService } from '../app/user/userManagement/userManagement.service';
import { UserManagementModel } from '../app/user/userManagement/userManagement.model';
import { PermissionService } from '../app/permission/permission.service';
import { IUserManagementCreate } from '../app/user/userManagement/userManagement.interface';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🔧 Configuration:');
console.log(`   Database URL: ${DATABASE_URL}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('🚀 Starting user management seeding process...');

// Default admin users for user management system
const defaultAdminUsers: IUserManagementCreate[] = [
  {
    email: 'admin@ecommerce.com',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+1-555-0001',
    role: 'admin',
    password: 'Admin123!@#',
    status: 'active',
    profileImage: '/images/admin-avatar.png',
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'AC',
      zipCode: '12345',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: true
    },
    permissions: [
      'users:create',
      'users:read',
      'users:update',
      'users:delete',
      'products:create',
      'products:read',
      'products:update',
      'products:delete',
      'orders:create',
      'orders:read',
      'orders:update',
      'orders:delete',
      'reports:read',
      'settings:update'
    ]
  },
  {
    email: 'manager@ecommerce.com',
    firstName: 'John',
    lastName: 'Manager',
    phone: '+1-555-0002',
    role: 'admin',
    password: 'Manager123!@#',
    status: 'active',
    profileImage: '/images/manager-avatar.png',
    address: {
      street: '456 Manager Avenue',
      city: 'Manager City',
      state: 'MC',
      zipCode: '23456',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: true
    },
    permissions: [
      'users:read',
      'users:update',
      'products:create',
      'products:read',
      'products:update',
      'orders:read',
      'orders:update',
      'reports:read'
    ]
  },
  {
    email: 'viewer@ecommerce.com',
    firstName: 'Jane',
    lastName: 'Viewer',
    phone: '+1-555-0003',
    role: 'admin',
    password: 'Viewer123!@#',
    status: 'active',
    profileImage: '/images/viewer-avatar.png',
    address: {
      street: '789 Viewer Boulevard',
      city: 'Viewer City',
      state: 'VC',
      zipCode: '34567',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: false
    },
    permissions: [
      'users:read',
      'products:read',
      'orders:read',
      'reports:read'
    ]
  }
];

// Default client users for user management system
const defaultClientUsers: IUserManagementCreate[] = [
  {
    email: 'customer1@example.com',
    firstName: 'Alice',
    lastName: 'Customer',
    phone: '+1-555-1001',
    role: 'client',
    password: 'Customer123!@#',
    status: 'active',
    profileImage: '/images/customer-avatar.png',
    address: {
      street: '100 Customer Street',
      city: 'Customer City',
      state: 'CC',
      zipCode: '45678',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: true
    },
    permissions: []
  },
  {
    email: 'customer2@example.com',
    firstName: 'Bob',
    lastName: 'Buyer',
    phone: '+1-555-1002',
    role: 'client',
    password: 'Buyer123!@#',
    status: 'active',
    profileImage: '/images/customer-avatar.png',
    address: {
      street: '200 Buyer Avenue',
      city: 'Buyer City',
      state: 'BC',
      zipCode: '56789',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: true
    },
    permissions: []
  },
  {
    email: 'customer3@example.com',
    firstName: 'Carol',
    lastName: 'Client',
    phone: '+1-555-1003',
    role: 'client',
    password: 'Client123!@#',
    status: 'inactive',
    profileImage: '/images/customer-avatar.png',
    address: {
      street: '300 Client Boulevard',
      city: 'Client City',
      state: 'CC',
      zipCode: '67890',
      country: 'USA'
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: false
    },
    permissions: []
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

// Function to create admin users using user management system
async function createAdminUsers(): Promise<void> {
  console.log('👤 Creating admin users using user management system...');
  
  for (const adminData of defaultAdminUsers) {
    try {
      // Check if admin already exists
      const existingAdmin = await UserManagementModel.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin with email ${adminData.email} already exists, skipping...`);
        continue;
      }
      
      // Create admin user using user management service
      const admin = await UserManagementService.createUser(adminData);
      console.log(`✅ Created admin: ${adminData.firstName} ${adminData.lastName} (${adminData.email})`);
      
    } catch (error) {
      console.error(`❌ Error creating admin ${adminData.email}:`, error);
      throw error;
    }
  }
  
  console.log('✅ Admin users created successfully');
}

// Function to create client users using user management system
async function createClientUsers(): Promise<void> {
  console.log('👥 Creating client users using user management system...');
  
  for (const clientData of defaultClientUsers) {
    try {
      // Check if client already exists
      const existingClient = await UserManagementModel.findOne({ email: clientData.email });
      
      if (existingClient) {
        console.log(`⚠️  Client with email ${clientData.email} already exists, skipping...`);
        continue;
      }
      
      // Create client user using user management service
      const client = await UserManagementService.createUser(clientData);
      console.log(`✅ Created client: ${clientData.firstName} ${clientData.lastName} (${clientData.email})`);
      
    } catch (error) {
      console.error(`❌ Error creating client ${clientData.email}:`, error);
      throw error;
    }
  }
  
  console.log('✅ Client users created successfully');
}

// Function to assign roles to users
async function assignRolesToUsers(): Promise<void> {
  console.log('🔗 Assigning roles to users...');
  
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
    
    // Get all users from user management system
    const users = await UserManagementModel.find({ role: 'admin' });
    console.log(`👤 Found ${users.length} admin users:`, users.map(u => u.email));
    
    for (const user of users) {
      let roleToAssign;
      
      // Assign roles based on email
      if (user.email === 'admin@ecommerce.com') {
        roleToAssign = superAdminRole;
      } else if (user.email === 'manager@ecommerce.com') {
        roleToAssign = managerRole;
      } else if (user.email === 'viewer@ecommerce.com') {
        roleToAssign = viewerRole;
      } else {
        // Default to admin role for other admins
        roleToAssign = adminRole;
      }
      
      console.log(`🔗 Assigning ${roleToAssign.name} role to ${user.email}...`);
      
      try {
        const result = await PermissionService.assignRoleToUser(
          String(user._id),
          String(roleToAssign._id),
          String(user._id) // Self-assigned for seed data
        );
        console.log(`✅ Successfully assigned ${roleToAssign.name} role to ${user.email}`);
        console.log(`   UserRole ID: ${result._id}`);
      } catch (error) {
        console.error(`❌ Error assigning role to ${user.email}:`, error);
        // Don't throw here, continue with other users
      }
    }
    
    console.log('✅ Role assignment process completed');
  } catch (error) {
    console.error('❌ Error in role assignment process:', error);
    throw error;
  }
}

// Function to display user credentials
function displayUserCredentials(): void {
  console.log('\n🎉 User management seeding completed successfully!');
  console.log('\n📋 Admin Credentials:');
  console.log('=====================================');
  
  defaultAdminUsers.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Role: ${getRoleForUser(user.email)}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Permissions: ${user.permissions?.length || 0} permissions`);
  });
  
  console.log('\n📋 Client Credentials:');
  console.log('=====================================');
  
  defaultClientUsers.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
  });
  
  console.log('\n🔐 Important Security Notes:');
  console.log('=====================================');
  console.log('• Change these passwords immediately after first login');
  console.log('• These are default credentials for development only');
  console.log('• Never use these credentials in production');
  console.log('• Consider using environment variables for production credentials');
  
  console.log('\n🚀 Next Steps:');
  console.log('=====================================');
  console.log('1. Start your backend server: bun dev');
  console.log('2. Start your frontend: cd front-end && bun dev');
  console.log('3. Login using any of the above credentials');
  console.log('4. Change the default passwords in the user settings');
  console.log('5. Create additional users as needed through the user management system');
}

// Helper function to get role for user email
function getRoleForUser(email: string): string {
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

// Function to verify user management setup
async function verifyUserManagementSetup(): Promise<void> {
  console.log('\n🔍 Verifying user management setup...');
  
  try {
    // Get user statistics
    const stats = await UserManagementService.getUserStats();
    console.log('\n📊 User Management Statistics:');
    console.log('=====================================');
    console.log(`Total Users: ${stats.totalUsers}`);
    console.log(`Admin Users: ${stats.adminUsers}`);
    console.log(`Client Users: ${stats.clientUsers}`);
    console.log(`Active Users: ${stats.activeUsers}`);
    console.log(`Inactive Users: ${stats.inactiveUsers}`);
    console.log(`Suspended Users: ${stats.suspendedUsers}`);
    
    // Check if permissions exist
    const permissions = await PermissionService.getAllPermissions();
    console.log(`\n✅ Found ${permissions.length} permissions`);
    
    // Check if roles exist
    const roles = await PermissionService.getAllRoles();
    console.log(`✅ Found ${roles.length} roles`);
    
    // Check role assignments for admin users
    const adminUsers = await UserManagementModel.find({ role: 'admin' });
    console.log('\n📋 Role Assignment Verification:');
    console.log('=====================================');
    
    for (const user of adminUsers) {
      try {
        const userRoles = await PermissionService.getUserRoles(String(user._id));
        console.log(`👤 ${user.email}:`);
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
        const userPermissions = await PermissionService.getUserPermissions(String(user._id));
        console.log(`   Permissions: ${userPermissions.length}`);
        
      } catch (error) {
        console.error(`❌ Error checking roles for ${user.email}:`, error);
      }
    }
    
    console.log('\n✅ User management setup verification completed');
  } catch (error) {
    console.error('❌ Error verifying user management setup:', error);
    throw error;
  }
}

// Function to force assign roles (in case they weren't assigned properly)
async function forceAssignRoles(): Promise<void> {
  console.log('\n🔧 Force assigning roles to ensure proper setup...');
  
  try {
    const roles = await PermissionService.getAllRoles();
    const adminUsers = await UserManagementModel.find({ role: 'admin' });
    
    for (const user of adminUsers) {
      // Check if user already has roles
      const existingRoles = await PermissionService.getUserRoles(String(user._id));
      
      if (existingRoles.length === 0) {
        console.log(`🔧 No roles found for ${user.email}, assigning default role...`);
        
        let roleToAssign;
        if (user.email === 'admin@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Super Admin');
        } else if (user.email === 'manager@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Manager');
        } else if (user.email === 'viewer@ecommerce.com') {
          roleToAssign = roles.find(role => role.name === 'Viewer');
        } else {
          roleToAssign = roles.find(role => role.name === 'Admin');
        }
        
        if (roleToAssign) {
          try {
            await PermissionService.assignRoleToUser(
              String(user._id),
              String(roleToAssign._id),
              String(user._id)
            );
            console.log(`✅ Force assigned ${roleToAssign.name} role to ${user.email}`);
          } catch (error) {
            console.error(`❌ Error force assigning role to ${user.email}:`, error);
          }
        }
      } else {
        console.log(`✅ ${user.email} already has ${existingRoles.length} role(s)`);
      }
    }
  } catch (error) {
    console.error('❌ Error in force role assignment:', error);
  }
}

// Main seeding function
async function seedUserManagement(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully');
    
    // Create default permissions
    await createDefaultPermissions();
    
    // Create default roles
    await createDefaultRoles();
    
    // Create admin users using user management system
    await createAdminUsers();
    
    // Create client users using user management system
    await createClientUsers();
    
    // Assign roles to admin users
    await assignRolesToUsers();
    
    // Force assign roles if needed
    await forceAssignRoles();
    
    // Verify setup
    await verifyUserManagementSetup();
    
    // Display credentials
    displayUserCredentials();
    
  } catch (error) {
    console.error('❌ Error during user management seeding:', error);
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
  seedUserManagement()
    .then(() => {
      console.log('\n🎉 User management seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 User management seeding process failed:', error);
      process.exit(1);
    });
}

export { seedUserManagement };
