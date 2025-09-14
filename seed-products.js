const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    for (const product of productsData) {
      const response = await fetch('http://localhost:5000/api/v1/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Product seeded: ${product.title}`);
      } else {
        console.error(`❌ Failed to seed product: ${product.title}`, result.message);
      }
    }
    
    console.log('✅ Product seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
}

// Wait a bit for the server to start, then seed
setTimeout(seedProducts, 5000);
