import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import AdminModel from '../app/user/admin/admin.model';
import { PermissionService } from '../app/permission/permission.service';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🔗 Starting role assignment process...');
console.log('=====================================');

// Function to assign roles to existing admins
async function assignRolesToExistingAdmins(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Get all roles
    const roles = await PermissionService.getAllRoles();
    console.log(`📋 Found ${roles.length} roles:`, roles.map(r => r.name));
    
    const superAdminRole = roles.find(role => role.name === 'Super Admin');
    const adminRole = roles.find(role => role.name === 'Admin');
    const managerRole = roles.find(role => role.name === 'Manager');
    const viewerRole = roles.find(role => role.name === 'Viewer');
    
    if (!superAdminRole || !adminRole || !managerRole || !viewerRole) {
      console.error('❌ Required roles not found. Please run seed:admin first to create roles.');
      return;
    }
    
    // Get all admins
    const admins = await AdminModel.find();
    console.log(`👤 Found ${admins.length} admin users:`, admins.map(a => a.email));
    
    if (admins.length === 0) {
      console.log('❌ No admin users found. Please run seed:admin first to create admin users.');
      return;
    }
    
    // Assign roles to each admin
    for (const admin of admins) {
      console.log(`\n🔗 Processing ${admin.email}...`);
      
      // Check existing roles
      const existingRoles = await PermissionService.getUserRoles(String(admin._id));
      console.log(`   Current roles: ${existingRoles.length}`);
      
      if (existingRoles.length > 0) {
        console.log(`   ✅ ${admin.email} already has roles assigned`);
        continue;
      }
      
      // Determine which role to assign
      let roleToAssign;
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
      
      console.log(`   Assigning ${roleToAssign.name} role...`);
      
      try {
        const result = await PermissionService.assignRoleToUser(
          String(admin._id),
          String(roleToAssign._id),
          String(admin._id) // Self-assigned
        );
        console.log(`   ✅ Successfully assigned ${roleToAssign.name} role`);
        console.log(`   UserRole ID: ${result._id}`);
        
        // Verify the assignment
        const userRoles = await PermissionService.getUserRoles(String(admin._id));
        const userPermissions = await PermissionService.getUserPermissions(String(admin._id));
        console.log(`   ✅ Verification: ${userRoles.length} role(s), ${userPermissions.length} permission(s)`);
        
        // Also verify the admin's roles array is updated
        const updatedAdmin = await AdminModel.findById(admin._id);
        console.log(`   ✅ Admin roles array: ${updatedAdmin?.roles?.length || 0} role(s)`);
        
      } catch (error) {
        console.error(`   ❌ Error assigning role to ${admin.email}:`, error);
      }
    }
    
    console.log('\n🎉 Role assignment process completed!');
    
  } catch (error) {
    console.error('❌ Error during role assignment:', error);
  } finally {
    // Close database connection
    console.log('\n🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the role assignment
if (require.main === module) {
  assignRolesToExistingAdmins()
    .then(() => {
      console.log('\n🎉 Role assignment completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Role assignment failed:', error);
      process.exit(1);
    });
}

export { assignRolesToExistingAdmins };
