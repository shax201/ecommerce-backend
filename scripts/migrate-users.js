const mongoose = require('mongoose');
const { UserManagementModel } = require('../dist/app/user/userManagement/userManagement.model');
const AdminModel = require('../dist/app/user/admin/admin.model');
const ClientModel = require('../dist/app/user/client/client.model');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Migration functions
const migrateAdminUsers = async () => {
  const results = { success: 0, failed: 0, errors: [] };

  try {
    const adminUsers = await AdminModel.find({});
    
    for (const admin of adminUsers) {
      try {
        // Check if user already exists in user management
        const existingUser = await UserManagementModel.findOne({ email: admin.email });
        if (existingUser) {
          console.log(`Admin user ${admin.email} already exists in user management system`);
          continue;
        }

        // Create new user management record
        const newUser = new UserManagementModel({
          email: admin.email,
          firstName: admin.firstName || 'Admin',
          lastName: admin.lastName || 'User',
          phone: undefined,
          role: 'admin',
          status: admin.status ? 'active' : 'inactive',
          lastLogin: undefined,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
          profileImage: admin.image,
          address: undefined,
          preferences: undefined,
          permissions: admin.permission ? Object.keys(admin.permission) : [],
          isEmailVerified: true,
          password: admin.password,
        });

        await newUser.save();
        results.success++;
        console.log(`Successfully migrated admin user: ${admin.email}`);
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to migrate admin user ${admin.email}: ${error.message}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg = `Error during admin migration: ${error.message}`;
    results.errors.push(errorMsg);
    console.error(errorMsg);
  }

  return results;
};

const migrateClientUsers = async () => {
  const results = { success: 0, failed: 0, errors: [] };

  try {
    const clientUsers = await ClientModel.find({});
    
    for (const client of clientUsers) {
      try {
        // Check if user already exists in user management
        const existingUser = await UserManagementModel.findOne({ email: client.email });
        if (existingUser) {
          console.log(`Client user ${client.email} already exists in user management system`);
          continue;
        }

        // Create new user management record
        const newUser = new UserManagementModel({
          email: client.email,
          firstName: client.firstName || 'Client',
          lastName: client.lastName || 'User',
          phone: client.phone?.toString(),
          role: 'client',
          status: client.status ? 'active' : 'inactive',
          lastLogin: undefined,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
          profileImage: client.image,
          address: client.address ? { street: client.address } : undefined,
          preferences: undefined,
          permissions: [],
          isEmailVerified: true,
          password: client.password,
        });

        await newUser.save();
        results.success++;
        console.log(`Successfully migrated client user: ${client.email}`);
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to migrate client user ${client.email}: ${error.message}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg = `Error during client migration: ${error.message}`;
    results.errors.push(errorMsg);
    console.error(errorMsg);
  }

  return results;
};

const runCompleteMigration = async () => {
  console.log('Starting user management migration...');
  
  const adminResults = await migrateAdminUsers();
  const clientResults = await migrateClientUsers();
  
  const totalSuccess = adminResults.success + clientResults.success;
  const totalFailed = adminResults.failed + clientResults.failed;
  
  console.log('Migration completed!');
  console.log(`Admin users migrated: ${adminResults.success} success, ${adminResults.failed} failed`);
  console.log(`Client users migrated: ${clientResults.success} success, ${clientResults.failed} failed`);
  console.log(`Total: ${totalSuccess} success, ${totalFailed} failed`);
  
  if (adminResults.errors.length > 0) {
    console.log('Admin migration errors:', adminResults.errors);
  }
  
  if (clientResults.errors.length > 0) {
    console.log('Client migration errors:', clientResults.errors);
  }
  
  return {
    adminResults,
    clientResults,
    totalSuccess,
    totalFailed,
  };
};

const verifyMigration = async () => {
  try {
    const [adminCount, clientCount, userManagementCount] = await Promise.all([
      AdminModel.countDocuments(),
      ClientModel.countDocuments(),
      UserManagementModel.countDocuments(),
    ]);

    const adminInUserManagement = await UserManagementModel.countDocuments({ role: 'admin' });
    const clientInUserManagement = await UserManagementModel.countDocuments({ role: 'client' });

    const isComplete = 
      adminCount === adminInUserManagement && 
      clientCount === clientInUserManagement;

    return {
      adminCount,
      clientCount,
      userManagementCount,
      adminInUserManagement,
      clientInUserManagement,
      isComplete,
    };
  } catch (error) {
    console.error('Error verifying migration:', error);
    throw error;
  }
};

const rollbackMigration = async () => {
  const results = { success: 0, failed: 0, errors: [] };

  try {
    const migratedUsers = await UserManagementModel.find({});
    
    for (const user of migratedUsers) {
      try {
        await UserManagementModel.findByIdAndDelete(user._id);
        results.success++;
        console.log(`Successfully rolled back user: ${user.email}`);
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to rollback user ${user.email}: ${error.message}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg = `Error during rollback: ${error.message}`;
    results.errors.push(errorMsg);
    console.error(errorMsg);
  }

  return results;
};

// Main migration function
const runMigration = async () => {
  try {
    await connectDB();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'migrate':
        console.log('Starting user migration...');
        const results = await runCompleteMigration();
        console.log('Migration completed:', results);
        break;
        
      case 'verify':
        console.log('Verifying migration...');
        const verification = await verifyMigration();
        console.log('Verification results:', verification);
        break;
        
      case 'rollback':
        console.log('Rolling back migration...');
        const rollbackResults = await rollbackMigration();
        console.log('Rollback completed:', rollbackResults);
        break;
        
      default:
        console.log('Usage: node migrate-users.js [migrate|verify|rollback]');
        console.log('  migrate  - Migrate existing users to new system');
        console.log('  verify   - Verify migration was successful');
        console.log('  rollback - Rollback migration (remove migrated users)');
        break;
    }
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run migration
runMigration();
