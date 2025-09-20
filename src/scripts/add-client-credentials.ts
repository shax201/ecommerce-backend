import mongoose from 'mongoose';
import { config } from '../config';
import { CourierProviderModel } from '../app/courier/courierProvider.model';
import { ClientCourierCredentialsModel } from '../app/courier/clientCourierCredentials.model';

interface ClientCredentialData {
  clientId: string;
  providerCode: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    username?: string;
    password?: string;
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
    additionalConfig?: Record<string, any>;
  };
  settings?: {
    autoBooking?: boolean;
    preferredDeliveryType?: string;
    maxWeight?: number;
    maxValue?: number;
    allowedCities?: string[];
    excludedCities?: string[];
  };
  isDefault?: boolean;
  priority?: number;
}

async function addClientCredentials(credentialData: ClientCredentialData) {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url);
    console.log('Connected to MongoDB');

    // Find the provider
    const provider = await CourierProviderModel.findOne({ code: credentialData.providerCode });
    if (!provider) {
      throw new Error(`Provider with code '${credentialData.providerCode}' not found`);
    }

    // Check if credentials already exist
    const existingCredentials = await ClientCourierCredentialsModel.findOne({
      clientId: credentialData.clientId,
      courierProviderId: provider._id
    });

    if (existingCredentials) {
      console.log(`Credentials already exist for client ${credentialData.clientId} and provider ${credentialData.providerCode}`);
      console.log('Updating existing credentials...');
      
      existingCredentials.credentials = credentialData.credentials;
      if (credentialData.settings) {
        existingCredentials.settings = { ...existingCredentials.settings, ...credentialData.settings };
      }
      if (credentialData.isDefault !== undefined) {
        existingCredentials.isDefault = credentialData.isDefault;
      }
      if (credentialData.priority !== undefined) {
        existingCredentials.priority = credentialData.priority;
      }
      
      await existingCredentials.save();
      console.log('Credentials updated successfully!');
    } else {
      // Create new credentials
      const clientCredentials = new ClientCourierCredentialsModel({
        clientId: credentialData.clientId,
        courierProviderId: provider._id,
        credentials: credentialData.credentials,
        isActive: true,
        isDefault: credentialData.isDefault || false,
        priority: credentialData.priority || 1,
        settings: {
          autoBooking: true,
          preferredDeliveryType: 'standard',
          maxWeight: 10,
          maxValue: 10000,
          allowedCities: [],
          excludedCities: [],
          ...credentialData.settings
        }
      });

      await clientCredentials.save();
      console.log(`Created new credentials for client ${credentialData.clientId} and provider ${credentialData.providerCode}`);
    }

    // Display the created/updated credentials
    const savedCredentials = await ClientCourierCredentialsModel.findOne({
      clientId: credentialData.clientId,
      courierProviderId: provider._id
    }).populate('courierProviderId');

    console.log('\n=== CREDENTIALS DETAILS ===');
    console.log(`Client ID: ${savedCredentials?.clientId}`);
    console.log(`Provider: ${savedCredentials?.courierProviderId.displayName}`);
    console.log(`Active: ${savedCredentials?.isActive}`);
    console.log(`Default: ${savedCredentials?.isDefault}`);
    console.log(`Priority: ${savedCredentials?.priority}`);
    console.log(`Auto Booking: ${savedCredentials?.settings.autoBooking}`);
    console.log(`Max Weight: ${savedCredentials?.settings.maxWeight} kg`);
    console.log(`Max Value: ${savedCredentials?.settings.maxValue} BDT`);

  } catch (error) {
    console.error('Error adding client credentials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Example usage function
async function addExampleCredentials() {
  // Example 1: Add Pathao credentials for a client
  await addClientCredentials({
    clientId: 'client-001',
    providerCode: 'pathao',
    credentials: {
      clientId: config.pathao.client_id,
      clientSecret: config.pathao.client_secret,
      username: config.pathao.username,
      password: config.pathao.password
    },
    settings: {
      autoBooking: true,
      preferredDeliveryType: 'standard',
      maxWeight: 5,
      maxValue: 5000,
      allowedCities: ['Dhaka', 'Chittagong'],
      excludedCities: []
    },
    isDefault: true,
    priority: 1
  });

  // Example 2: Add RedX credentials for the same client
  await addClientCredentials({
    clientId: 'client-001',
    providerCode: 'redx',
    credentials: {
      clientId: 'redx_client_id',
      clientSecret: 'redx_client_secret',
      apiKey: 'redx_api_key'
    },
    settings: {
      autoBooking: false,
      preferredDeliveryType: 'express',
      maxWeight: 10,
      maxValue: 10000
    },
    isDefault: false,
    priority: 2
  });

  // Example 3: Add Steadfast credentials for another client
  await addClientCredentials({
    clientId: 'client-002',
    providerCode: 'steadfast',
    credentials: {
      clientId: 'steadfast_client_id',
      clientSecret: 'steadfast_client_secret',
      apiKey: 'steadfast_api_key'
    },
    settings: {
      autoBooking: true,
      preferredDeliveryType: 'standard',
      maxWeight: 15,
      maxValue: 15000
    },
    isDefault: true,
    priority: 1
  });
}

// Run the example if this file is executed directly
if (require.main === module) {
  console.log('Adding example client credentials...');
  addExampleCredentials();
}

export { addClientCredentials };

