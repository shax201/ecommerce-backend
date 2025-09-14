const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const companySettingsData = {
  companyName: "Ecommerce Store",
  logo: "https://via.placeholder.com/150",
  gtmScript: "<!-- Google Tag Manager -->",
  contactInfo: {
    email: "contact@ecommerce.com",
    phone: "+1234567890",
    website: "https://ecommerce.com",
    socialMedia: {
      facebook: "https://facebook.com/ecommerce",
      twitter: "https://twitter.com/ecommerce",
      instagram: "https://instagram.com/ecommerce"
    }
  },
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  preferences: {
    timezone: "UTC",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    language: "en"
  }
};

async function seedCompanySettings() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/company-setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companySettingsData)
    });

    const result = await response.json();
    console.log('Company settings seeded:', result);
  } catch (error) {
    console.error('Error seeding company settings:', error);
  }
}

seedCompanySettings();
