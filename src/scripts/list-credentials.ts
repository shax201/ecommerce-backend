import mongoose from 'mongoose';
import { config } from '../config';
import { CourierProviderModel } from '../app/courier/courierProvider.model';
import { ClientCourierCredentialsModel } from '../app/courier/clientCourierCredentials.model';

async function listAllCredentials() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url);
    console.log('Connected to MongoDB');

    // Get all courier providers
    const providers = await CourierProviderModel.find({}).sort({ name: 1 });
    console.log('\n=== COURIER PROVIDERS ===');
    providers.forEach(provider => {
      console.log(`\n${provider.displayName} (${provider.code})`);
      console.log(`  Status: ${provider.isActive ? 'Active' : 'Inactive'}`);
      console.log(`  Base URL: ${provider.apiConfig.baseUrl}`);
      console.log(`  Auth Type: ${provider.apiConfig.authType}`);
      console.log(`  Features: ${Object.entries(provider.supportedFeatures)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(', ')}`);
      console.log(`  Delivery Types: ${Object.values(provider.deliveryTypes)
        .map(dt => `${dt.name} (${dt.estimatedDays} days)`)
        .join(', ')}`);
      console.log(`  Coverage: ${provider.coverage.cities.join(', ')}`);
    });

    // Get all client credentials
    const credentials = await ClientCourierCredentialsModel.find({})
      .populate('courierProviderId')
      .sort({ clientId: 1, priority: 1 });

    console.log('\n=== CLIENT CREDENTIALS ===');
    
    if (credentials.length === 0) {
      console.log('No client credentials found.');
    } else {
      // Group by client ID
      const credentialsByClient = credentials.reduce((acc, cred) => {
        if (!acc[cred.clientId]) {
          acc[cred.clientId] = [];
        }
        acc[cred.clientId].push(cred);
        return acc;
      }, {} as Record<string, any[]>);

      Object.entries(credentialsByClient).forEach(([clientId, clientCreds]) => {
        console.log(`\nClient: ${clientId}`);
        clientCreds.forEach(cred => {
          console.log(`  Provider: ${cred.courierProviderId.displayName}`);
          console.log(`    Status: ${cred.isActive ? 'Active' : 'Inactive'}`);
          console.log(`    Default: ${cred.isDefault ? 'Yes' : 'No'}`);
          console.log(`    Priority: ${cred.priority}`);
          console.log(`    Client ID: ${cred.credentials.clientId}`);
          console.log(`    Username: ${cred.credentials.username || 'N/A'}`);
          console.log(`    API Key: ${cred.credentials.apiKey ? '***' : 'N/A'}`);
          console.log(`    Auto Booking: ${cred.settings.autoBooking ? 'Yes' : 'No'}`);
          console.log(`    Max Weight: ${cred.settings.maxWeight} kg`);
          console.log(`    Max Value: ${cred.settings.maxValue} BDT`);
          console.log(`    Preferred Delivery: ${cred.settings.preferredDeliveryType}`);
          console.log(`    Allowed Cities: ${cred.settings.allowedCities.join(', ') || 'All'}`);
          console.log(`    Excluded Cities: ${cred.settings.excludedCities.join(', ') || 'None'}`);
          console.log(`    Created: ${cred.createdAt.toISOString()}`);
          console.log(`    Updated: ${cred.updatedAt.toISOString()}`);
        });
      });
    }

    // Summary statistics
    console.log('\n=== SUMMARY ===');
    console.log(`Total Providers: ${providers.length}`);
    console.log(`Active Providers: ${providers.filter(p => p.isActive).length}`);
    console.log(`Total Credentials: ${credentials.length}`);
    console.log(`Active Credentials: ${credentials.filter(c => c.isActive).length}`);
    console.log(`Unique Clients: ${new Set(credentials.map(c => c.clientId)).size}`);

  } catch (error) {
    console.error('Error listing credentials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script if executed directly
if (require.main === module) {
  listAllCredentials();
}

export { listAllCredentials };

