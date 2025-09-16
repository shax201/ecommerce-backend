import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { seedAdmin } from './seedAdmin';
import { seedUserManagement } from './seedUserManagement';
import { seedContent } from './seedContent';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🚀 Starting complete database seeding process...');
console.log('=====================================');

// Main seeding function
async function seedAll(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Run admin seeding (legacy system)
    console.log('👤 Seeding admin users and permissions (legacy system)...');
    console.log('=====================================');
    await seedAdmin();
    
    // Run user management seeding (new system)
    console.log('\n👥 Seeding user management system...');
    console.log('=====================================');
    await seedUserManagement();
    
    console.log('\n📄 Seeding content data...');
    console.log('=====================================');
    await seedContent();
    
    console.log('\n🎉 Complete database seeding process finished successfully!');
    console.log('=====================================');
    console.log('✅ Admin users created with full permissions (legacy system)');
    console.log('✅ User management system seeded with admin and client users');
    console.log('✅ Default permissions and roles created');
    console.log('✅ Content data seeded');
    console.log('\n🚀 Your ecommerce application is ready to use!');
    console.log('\n💡 You can now use either the legacy admin system or the new user management system');
    
  } catch (error) {
    console.error('❌ Error during complete seeding process:', error);
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
  seedAll()
    .then(() => {
      console.log('\n🎉 Complete seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Complete seeding process failed:', error);
      process.exit(1);
    });
}

export { seedAll };
