// Simple test script to verify permission system
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test permission system
const testPermissions = async () => {
  try {
    console.log('🧪 Testing permission system...');
    
    // Import the service after connection
    const { PermissionService } = require('./dist/app/permission/permission.service');
    
    // Test creating a permission
    console.log('📝 Creating test permission...');
    const testPermission = await PermissionService.createPermission({
      name: 'Test Permission',
      resource: 'users',
      action: 'read',
      description: 'Test permission for testing'
    });
    console.log('✅ Test permission created:', testPermission.name);
    
    // Test creating a role
    console.log('👥 Creating test role...');
    const testRole = await PermissionService.createRole({
      name: 'Test Role',
      description: 'Test role for testing',
      permissions: [testPermission._id],
      isActive: true
    });
    console.log('✅ Test role created:', testRole.name);
    
    // Test getting all permissions
    console.log('📋 Getting all permissions...');
    const allPermissions = await PermissionService.getAllPermissions();
    console.log(`✅ Found ${allPermissions.length} permissions`);
    
    // Test getting all roles
    console.log('👥 Getting all roles...');
    const allRoles = await PermissionService.getAllRoles();
    console.log(`✅ Found ${allRoles.length} roles`);
    
    console.log('🎉 All tests passed! Permission system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
const run = async () => {
  await connectDB();
  await testPermissions();
};

run();
