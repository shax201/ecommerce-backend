import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import AdminModel from '../app/user/admin/admin.model';
import { PermissionService } from '../app/permission/permission.service';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🔧 Starting admin roles fix process...');
console.log('=====================================');

// Function to fix admin roles arrays
async function fixAdminRoles(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Get all admins
    const admins = await AdminModel.find();
    console.log(`👤 Found ${admins.length} admin users`);
    
    if (admins.length === 0) {
      console.log('❌ No admin users found.');
      return;
    }
    
    // Get all roles
    const roles = await PermissionService.getAllRoles();
    console.log(`📋 Found ${roles.length} roles`);
    
    // Fix each admin
    for (const admin of admins) {
      console.log(`\n🔧 Processing ${admin.email}...`);
      console.log(`   Current roles array: ${admin.roles?.length || 0} role(s)`);
      
      // Get user roles from UserRole collection
      const userRoles = await PermissionService.getUserRoles(String(admin._id));
      console.log(`   UserRole documents: ${userRoles.length} role(s)`);
      
      if (userRoles.length === 0) {
        console.log(`   ⚠️  No UserRole documents found for ${admin.email}`);
        continue;
      }
      
      // Get the role IDs from UserRole documents
      const roleIds = userRoles
        .filter(ur => ur.isActive)
        .map(ur => ur.roleId);
      
      console.log(`   Active role IDs: ${roleIds.length} role(s)`);
      
      if (roleIds.length === 0) {
        console.log(`   ⚠️  No active roles found for ${admin.email}`);
        continue;
      }
      
      // Update the admin's roles array
      try {
        const updatedAdmin = await AdminModel.findByIdAndUpdate(
          admin._id,
          { 
            $set: { 
              roles: roleIds
            } 
          },
          { new: true }
        );
        
        console.log(`   ✅ Updated admin roles array: ${updatedAdmin?.roles?.length || 0} role(s)`);
        
        // Verify the update
        const finalAdmin = await AdminModel.findById(admin._id);
        console.log(`   ✅ Final verification: ${finalAdmin?.roles?.length || 0} role(s) in array`);
        
      } catch (error) {
        console.error(`   ❌ Error updating roles array for ${admin.email}:`, error);
      }
    }
    
    console.log('\n🎉 Admin roles fix process completed!');
    
  } catch (error) {
    console.error('❌ Error during admin roles fix:', error);
  } finally {
    // Close database connection
    console.log('\n🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the fix
if (require.main === module) {
  fixAdminRoles()
    .then(() => {
      console.log('\n🎉 Admin roles fix completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Admin roles fix failed:', error);
      process.exit(1);
    });
}

export { fixAdminRoles };
