import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { 
  LogoModel, 
  HeroSectionModel, 
  ClientLogoModel, 
  FooterModel 
} from '../app/content/content.model';
import { ILogo, IHeroSection, IClientLogo, IFooter } from '../app/content/content.interface';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

console.log('🔧 Configuration:');
console.log(`   Database URL: ${DATABASE_URL}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('🚀 Starting content seeding process...');

// Default data for seeding
const defaultLogos: Partial<ILogo>[] = [
  {
    name: 'Main Logo',
    description: 'Primary company logo for header and branding',
    url: '/images/logo-main.png',
    altText: 'Ecommerce Store Main Logo',
    type: 'main',
    isActive: true
  },
  {
    name: 'Footer Logo',
    description: 'Logo for footer section',
    url: '/images/logo-footer.png',
    altText: 'Ecommerce Store Footer Logo',
    type: 'footer',
    isActive: true
  },
  {
    name: 'Favicon',
    description: 'Website favicon',
    url: '/images/favicon.ico',
    altText: 'Ecommerce Store Favicon',
    type: 'favicon',
    isActive: true
  }
];

const defaultHeroSections: Partial<IHeroSection>[] = [
  {
    title: 'Welcome to Our Store',
    subtitle: 'Discover Amazing Products',
    description: 'Shop the latest trends and find everything you need in one place. Quality products at unbeatable prices.',
    primaryButtonText: 'Shop Now',
    primaryButtonLink: '/shop',
    secondaryButtonText: 'Learn More',
    secondaryButtonLink: '/about',
    backgroundImage: '/images/header-homepage.png',
    backgroundImageAlt: 'Modern shopping experience',
    isActive: true,
    order: 1
  },
  {
    title: 'New Collection',
    subtitle: 'Spring 2024',
    description: 'Explore our latest collection featuring the newest trends and styles for the season.',
    primaryButtonText: 'View Collection',
    primaryButtonLink: '/shop?collection=spring-2024',
    secondaryButtonText: 'See All',
    secondaryButtonLink: '/shop',
    backgroundImage: '/images/header-res-homepage.png',
    backgroundImageAlt: 'Spring 2024 collection',
    isActive: true,
    order: 2
  }
];

const defaultClientLogos: Partial<IClientLogo>[] = [
  {
    name: 'Calvin Klein',
    description: 'Calvin Klein brand logo',
    logoUrl: '/icons/calvin-klein-logo.svg',
    websiteUrl: 'https://www.calvinklein.com',
    altText: 'Calvin Klein Logo',
    isActive: true,
    order: 1
  },
  {
    name: 'Gucci',
    description: 'Gucci brand logo',
    logoUrl: '/icons/gucci-logo.svg',
    websiteUrl: 'https://www.gucci.com',
    altText: 'Gucci Logo',
    isActive: true,
    order: 2
  },
  {
    name: 'Prada',
    description: 'Prada brand logo',
    logoUrl: '/icons/prada-logo.svg',
    websiteUrl: 'https://www.prada.com',
    altText: 'Prada Logo',
    isActive: true,
    order: 3
  },
  {
    name: 'Versace',
    description: 'Versace brand logo',
    logoUrl: '/icons/versace-logo.svg',
    websiteUrl: 'https://www.versace.com',
    altText: 'Versace Logo',
    isActive: true,
    order: 4
  },
  {
    name: 'Zara',
    description: 'Zara brand logo',
    logoUrl: '/icons/zara-logo.svg',
    websiteUrl: 'https://www.zara.com',
    altText: 'Zara Logo',
    isActive: true,
    order: 5
  }
];

const defaultFooter: Partial<IFooter> = {
  sections: [
    {
      title: 'Shop',
      links: [
        {
          title: 'New Arrivals',
          url: '/shop?filter=new',
          isExternal: false,
          isActive: true,
          order: 1
        },
        {
          title: 'Best Sellers',
          url: '/shop?filter=bestsellers',
          isExternal: false,
          isActive: true,
          order: 2
        },
        {
          title: 'Sale',
          url: '/shop?filter=sale',
          isExternal: false,
          isActive: true,
          order: 3
        },
        {
          title: 'Categories',
          url: '/shop',
          isExternal: false,
          isActive: true,
          order: 4
        }
      ],
      isActive: true,
      order: 1
    },
    {
      title: 'Customer Service',
      links: [
        {
          title: 'Contact Us',
          url: '/contact',
          isExternal: false,
          isActive: true,
          order: 1
        },
        {
          title: 'Shipping Info',
          url: '/shipping',
          isExternal: false,
          isActive: true,
          order: 2
        },
        {
          title: 'Returns',
          url: '/returns',
          isExternal: false,
          isActive: true,
          order: 3
        },
        {
          title: 'Size Guide',
          url: '/size-guide',
          isExternal: false,
          isActive: true,
          order: 4
        },
        {
          title: 'FAQ',
          url: '/faq',
          isExternal: false,
          isActive: true,
          order: 5
        }
      ],
      isActive: true,
      order: 2
    },
    {
      title: 'Company',
      links: [
        {
          title: 'About Us',
          url: '/about',
          isExternal: false,
          isActive: true,
          order: 1
        },
        {
          title: 'Careers',
          url: '/careers',
          isExternal: false,
          isActive: true,
          order: 2
        },
        {
          title: 'Press',
          url: '/press',
          isExternal: false,
          isActive: true,
          order: 3
        },
        {
          title: 'Sustainability',
          url: '/sustainability',
          isExternal: false,
          isActive: true,
          order: 4
        }
      ],
      isActive: true,
      order: 3
    },
    {
      title: 'Legal',
      links: [
        {
          title: 'Privacy Policy',
          url: '/privacy',
          isExternal: false,
          isActive: true,
          order: 1
        },
        {
          title: 'Terms of Service',
          url: '/terms',
          isExternal: false,
          isActive: true,
          order: 2
        },
        {
          title: 'Cookie Policy',
          url: '/cookies',
          isExternal: false,
          isActive: true,
          order: 3
        },
        {
          title: 'Accessibility',
          url: '/accessibility',
          isExternal: false,
          isActive: true,
          order: 4
        }
      ],
      isActive: true,
      order: 4
    }
  ],
  contactInfo: {
    email: 'support@ecommercestore.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street, New York, NY 10001',
    socialMedia: {
      facebook: 'https://facebook.com/ecommercestore',
      twitter: 'https://twitter.com/ecommercestore',
      instagram: 'https://instagram.com/ecommercestore',
      github: 'https://github.com/ecommercestore'
    }
  },
  copyright: '© 2024 Ecommerce Store. All rights reserved.',
  description: 'Your one-stop destination for the latest fashion trends and quality products.',
  logoUrl: '/images/logo-footer.png',
  logoAlt: 'Ecommerce Store Footer Logo'
};

// Database connection function
async function connectToDatabase() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`   URL: ${DATABASE_URL}`);
    
    // Set connection timeout
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Make sure MongoDB is running and the DATABASE_URL is correct');
    console.log('💡 If using MongoDB Atlas, check your IP whitelist and credentials');
    process.exit(1);
  }
}

// Clear existing data function
async function clearExistingData() {
  try {
    console.log('🧹 Clearing existing content data...');
    await Promise.all([
      LogoModel.deleteMany({}),
      HeroSectionModel.deleteMany({}),
      ClientLogoModel.deleteMany({}),
      FooterModel.deleteMany({})
    ]);
    console.log('✅ Existing content data cleared');
  } catch (error) {
    console.error('❌ Error clearing existing data:', error);
    throw error;
  }
}

// Seed logos
async function seedLogos() {
  try {
    console.log('📝 Seeding logos...');
    const logos = await LogoModel.insertMany(defaultLogos);
    console.log(`✅ Seeded ${logos.length} logos`);
    return logos;
  } catch (error) {
    console.error('❌ Error seeding logos:', error);
    throw error;
  }
}

// Seed hero sections
async function seedHeroSections() {
  try {
    console.log('📝 Seeding hero sections...');
    const heroSections = await HeroSectionModel.insertMany(defaultHeroSections);
    console.log(`✅ Seeded ${heroSections.length} hero sections`);
    return heroSections;
  } catch (error) {
    console.error('❌ Error seeding hero sections:', error);
    throw error;
  }
}

// Seed client logos
async function seedClientLogos() {
  try {
    console.log('📝 Seeding client logos...');
    const clientLogos = await ClientLogoModel.insertMany(defaultClientLogos);
    console.log(`✅ Seeded ${clientLogos.length} client logos`);
    return clientLogos;
  } catch (error) {
    console.error('❌ Error seeding client logos:', error);
    throw error;
  }
}

// Seed footer
async function seedFooter() {
  try {
    console.log('📝 Seeding footer...');
    const footer = new FooterModel(defaultFooter);
    const savedFooter = await footer.save();
    console.log('✅ Seeded footer with sections and contact info');
    return savedFooter;
  } catch (error) {
    console.error('❌ Error seeding footer:', error);
    throw error;
  }
}

// Main seed function
async function seedContent() {
  try {
    console.log('🌱 Starting content seeding process...');
    
    // Connect to database
    await connectToDatabase();
    
    // Clear existing data
    await clearExistingData();
    
    // Seed all content types
    const [logos, heroSections, clientLogos, footer] = await Promise.all([
      seedLogos(),
      seedHeroSections(),
      seedClientLogos(),
      seedFooter()
    ]);
    
    console.log('\n🎉 Content seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Logos: ${logos.length}`);
    console.log(`   - Hero Sections: ${heroSections.length}`);
    console.log(`   - Client Logos: ${clientLogos.length}`);
    console.log(`   - Footer: 1 (with ${footer.sections.length} sections)`);
    
  } catch (error) {
    console.error('❌ Content seeding failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function if this file is executed directly
console.log('🔍 Checking if script should run...');
console.log('   import.meta.url:', import.meta.url);
console.log('   process.argv[1]:', process.argv[1]);

// Check if this file is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1]?.includes('seedContent.ts');

if (isMainModule) {
  console.log('✅ Script execution condition met, starting seed...');
  seedContent();
} else {
  console.log('❌ Script execution condition not met');
  console.log('   This might be why the script is not running');
}

export { seedContent };
