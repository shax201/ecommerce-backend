import mongoose from 'mongoose';
import { config } from '../config';
import CourierCredentialsModel from '../app/courier/courierCredentials.model';

async function initCourierProviders() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connected to database');

    // Check if courier credentials already exist
    const existingCredentials = await CourierCredentialsModel.find();
    
    if (existingCredentials.length > 0) {
      console.log('Courier credentials already exist:');
      existingCredentials.forEach(cred => {
        console.log(`- ${cred.courier}: ${cred.isActive ? 'Active' : 'Inactive'}`);
      });
      return;
    }

    // Initialize with empty credentials (to be filled by admin)
    const pathaoCredentials = new CourierCredentialsModel({
      courier: 'pathao',
      credentials: {
        client_id: '',
        client_secret: '',
        username: '',
        password: '',
        base_url: 'https://api-hermes.pathao.com'
      },
      isActive: false
    });

    const steadfastCredentials = new CourierCredentialsModel({
      courier: 'steadfast',
      credentials: {
        api_key: '',
        secret_key: '',
        base_url: 'https://portal.packzy.com/api/v1'
      },
      isActive: false
    });

    await pathaoCredentials.save();
    await steadfastCredentials.save();

    console.log('Courier providers initialized successfully!');
    console.log('Please configure credentials through the admin panel:');
    console.log('- Pathao: /api/v1/courier/credentials/pathao');
    console.log('- Steadfast: /api/v1/courier/credentials/steadfast');

  } catch (error) {
    console.error('Error initializing courier providers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
initCourierProviders();