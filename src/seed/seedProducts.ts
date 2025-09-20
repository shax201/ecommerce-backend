import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { SimpleProductModel } from './simpleProduct.model';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';

// Helper function to create complete product data
function createProductData(baseData: any, index: number) {
  const sku = `PRD-${String(index + 1).padStart(3, '0')}`;
  const barcode = `1234567890${String(index + 1).padStart(3, '0')}`;
  
  return {
    ...baseData,
    shortDescription: baseData.shortDescription || baseData.description.substring(0, 100),
    costPrice: baseData.costPrice || Math.round(baseData.regularPrice * 0.5),
    sku,
    barcode,
    weight: baseData.weight || 0.3,
    dimensions: baseData.dimensions || {
      length: 80,
      width: 60,
      height: 2,
      unit: "cm"
    },
    inventory: baseData.inventory || {
      totalStock: 50,
      reservedStock: 0,
      availableStock: 50,
      lowStockThreshold: 10,
      trackInventory: true
    },
    status: baseData.status || "active",
    featured: baseData.featured || false,
    tags: baseData.tags || ["clothing", "fashion"]
  };
}

const productsData = [
  {
    title: "Casual Cotton T-Shirt",
    description: "A comfortable cotton t-shirt perfect for everyday wear.",
    primaryImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    optionalImages: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&crop=center",
    ],
    regularPrice: 1200,
    discountPrice: 950,
    videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111", "66c1b4b5a1b2c3d4e5f6c112"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    featured: true,
    tags: ["cotton", "casual", "t-shirt", "comfortable"],
    productType: "top_selling",
  },
  {
    title: "Slim Fit Jeans",
    description: "Stylish slim-fit jeans made with stretchable denim.",
    primaryImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2500,
    discountPrice: 1990,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "new_arrival",
  },
  {
    title: "Classic White Shirt",
    description: "Elegant white dress shirt perfect for formal occasions.",
    primaryImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1800,
    discountPrice: 1440,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "featured",
  },
  {
    title: "Denim Jacket",
    description: "Classic denim jacket with a modern fit and vintage wash.",
    primaryImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 3500,
    discountPrice: 2800,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "new_arrival",
  },
  {
    title: "Cargo Pants",
    description: "Comfortable cargo pants with multiple pockets for utility.",
    primaryImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2200,
    discountPrice: 1760,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c112"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "top_selling",
  },
  {
    title: "Hoodie Sweatshirt",
    description: "Cozy hoodie sweatshirt perfect for casual wear.",
    primaryImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2800,
    discountPrice: 2240,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111", "66c1b4b5a1b2c3d4e5f6c112"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "featured",
  },
  {
    title: "Chino Shorts",
    description: "Comfortable chino shorts ideal for summer wear.",
    primaryImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1500,
    discountPrice: 1200,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "new_arrival",
  },
  {
    title: "Polo Shirt",
    description: "Classic polo shirt with a comfortable fit and collar.",
    primaryImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1600,
    discountPrice: 1280,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c111", "66c1b4b5a1b2c3d4e5f6d222"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "top_selling",
  },
  {
    title: "Track Pants",
    description: "Athletic track pants with side stripes and elastic waist.",
    primaryImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2000,
    discountPrice: 1600,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c112"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "featured",
  },
  {
    title: "Flannel Shirt",
    description: "Warm flannel shirt with classic plaid pattern.",
    primaryImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2400,
    discountPrice: 1920,
    catagory: ["66c1b4b5a1b2c3d4e5f6a7b8"],
    color: ["66c1b4b5a1b2c3d4e5f6c112"],
    size: ["66c1b4b5a1b2c3d4e5f6d221", "66c1b4b5a1b2c3d4e5f6d222"],
    productType: "new_arrival",
  }
];

console.log('🚀 Starting product seeding process...');
console.log('=====================================');

// Main seeding function
async function seedProducts(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Clear existing products (optional)
    console.log('🗑️ Clearing existing products...');
    await SimpleProductModel.deleteMany({});
    console.log('✅ Existing products cleared\n');
    
    // Insert new products
    console.log('📦 Inserting products...');
    const completeProductsData = productsData.map((product, index) => createProductData(product, index));
    const insertedProducts = await SimpleProductModel.insertMany(completeProductsData);
    console.log(`✅ Successfully inserted ${insertedProducts.length} products\n`);
    
    // Display summary
    console.log('📊 Product Seeding Summary:');
    console.log('=====================================');
    console.log(`✅ Total products inserted: ${insertedProducts.length}`);
    console.log(`✅ Top selling products: ${insertedProducts.filter(p => p.productType === 'top_selling').length}`);
    console.log(`✅ New arrivals: ${insertedProducts.filter(p => p.productType === 'new_arrival').length}`);
    console.log(`✅ Featured products: ${insertedProducts.filter(p => p.productType === 'featured').length}`);
    console.log('\n🎉 Product seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during product seeding:', error);
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
  seedProducts()
    .then(() => {
      console.log('\n🎉 Product seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Product seeding process failed:', error);
      process.exit(1);
    });
}

export { seedProducts };
