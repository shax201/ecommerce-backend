const mongoose = require('mongoose');
const { PermissionService } = require('./dist/app/permission/permission.service');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize default permissions and roles
const initializePermissions = async () => {
  try {
    console.log('Initializing default permissions and roles...');
    
    // Create default permissions
    await PermissionService.createDefaultPermissions();
    console.log('✅ Default permissions created successfully');
    
    // Create default roles
    await PermissionService.createDefaultRoles();
    console.log('✅ Default roles created successfully');
    
    console.log('🎉 Permission system initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing permissions:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the initialization
const run = async () => {
  await connectDB();
  await initializePermissions();
};

run();
