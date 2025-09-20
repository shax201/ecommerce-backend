# Product Seeding Guide

## Overview
This guide explains how to seed products into your ecommerce database.

## Why the original script didn't work

The original `seed-products.js` script failed because:

1. **Authentication Required**: The `/api/v1/products/seed_products` endpoint requires authentication and the `products:create` permission
2. **Missing Request/Response Handling**: The controller function wasn't properly set up as an Express route handler
3. **No Authentication Token**: The script didn't include any authentication headers

## Solutions

### Option 1: Use the TypeScript Seeding Script (Recommended)

The proper way to seed products is using the TypeScript seeding script that connects directly to the database:

```bash
# Seed only products
bun run seed:products

# Or seed everything including products
bun run seed:all
```

### Option 2: Fix the HTTP Endpoint (If you prefer API calls)

If you want to use the HTTP endpoint, you need to:

1. **Get an authentication token** by logging in as an admin user
2. **Include the token** in the request headers
3. **Ensure the user has the required permissions**

Example of a fixed HTTP script:

```javascript
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// First, get authentication token
async function getAuthToken() {
  const response = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@example.com', // Use your admin credentials
      password: 'your-password'
    })
  });
  
  const result = await response.json();
  return result.token; // Assuming the API returns a token
}

async function seedProducts() {
  try {
    const token = await getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/v1/products/seed_products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token
      },
      body: JSON.stringify(productsData)
    });

    const result = await response.json();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Available Seeding Scripts

- `bun run seed:products` - Seed only products
- `bun run seed:all` - Seed everything (admin, users, content, products)
- `bun run seed:admin` - Seed only admin users
- `bun run seed:user-management` - Seed user management system
- `bun run seed:content` - Seed content data

## Product Data Structure

The seeded products include:
- 10 different clothing items
- Various product types: `top_selling`, `new_arrival`, `featured`
- Different categories, colors, and sizes
- High-quality Unsplash images
- Realistic pricing

## Database Connection

The seeding scripts automatically connect to MongoDB using the `DATABASE_URL` environment variable. Make sure your `.env` file contains:

```
DATABASE_URL=mongodb://localhost:27017/ecommerce
```

## Troubleshooting

1. **Database Connection Issues**: Ensure MongoDB is running and the connection string is correct
2. **Permission Errors**: Make sure you have the required database permissions
3. **Duplicate Data**: The scripts clear existing data before inserting new data
4. **Environment Variables**: Ensure all required environment variables are set in your `.env` file
