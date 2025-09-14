# Enhanced Product Module

A comprehensive product management system with advanced features including inventory management, analytics, reviews, wishlist, and order integration.

## 🚀 Features

### Core Product Management
- **Enhanced Product Model** with inventory tracking, variants, and SEO
- **SKU and Barcode Management** for product identification
- **Product Variants** with color, size, and pricing options
- **Inventory Management** with stock tracking and low stock alerts
- **SEO Optimization** with meta tags, slugs, and canonical URLs

### Analytics & Reporting
- **Product Performance Metrics** - views, purchases, conversion rates
- **Inventory Reports** - stock value, turnover rates, low stock alerts
- **Sales Analytics** - revenue tracking, top-selling products
- **Category Performance** - category-wise analytics and insights
- **Real-time Tracking** - product views and purchase tracking

### Reviews & Ratings System
- **Product Reviews** with ratings, comments, and images
- **Review Management** - approval, moderation, admin responses
- **Review Statistics** - average ratings, distribution analysis
- **Verified Reviews** - purchase verification for authentic reviews
- **Review Helpfulness** - user voting on review helpfulness

### Wishlist & Favorites
- **Personal Wishlist** - save products for later
- **Priority Management** - organize wishlist by priority levels
- **Wishlist Analytics** - track wishlist performance and value
- **Recommendations** - personalized product suggestions
- **Cart Integration** - move items from wishlist to cart

### Search & Filtering
- **Advanced Search** - full-text search across products
- **Smart Filtering** - by category, price, rating, availability
- **Sorting Options** - by price, rating, popularity, date
- **Faceted Search** - multiple filter combinations

## 📁 Module Structure

```
product/
├── product.model.ts              # Enhanced product schema
├── product.interface.ts          # TypeScript interfaces
├── product.service.ts            # Core product services
├── product.controller.ts         # Product controllers
├── product.routes.ts             # Main product routes
├── productAnalytics.service.ts   # Analytics services
├── productAnalytics.controller.ts # Analytics controllers
├── productAnalytics.route.ts     # Analytics routes
├── productReview.model.ts        # Review schema
├── productReview.service.ts      # Review services
├── productReview.controller.ts   # Review controllers
├── productReview.route.ts        # Review routes
├── productWishlist.model.ts      # Wishlist schema
├── productWishlist.service.ts    # Wishlist services
├── productWishlist.controller.ts # Wishlist controllers
├── productWishlist.route.ts      # Wishlist routes
├── index.ts                      # Unified exports
└── README.md                     # This file
```

## 🛠 API Endpoints

### Core Product Endpoints
- `GET /api/v1/products` - Get all products with filtering
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products/create` - Create new product (Admin)
- `PUT /api/v1/products/update/:id` - Update product (Admin)
- `DELETE /api/v1/products/delete/:id` - Delete product (Admin)

### Analytics Endpoints
- `GET /api/v1/products/analytics` - Get product analytics
- `GET /api/v1/products/analytics/performance` - Get performance metrics
- `GET /api/v1/products/analytics/inventory-report` - Get inventory report
- `GET /api/v1/products/analytics/top-selling` - Get top selling products
- `POST /api/v1/products/analytics/:productId/view` - Track product view
- `POST /api/v1/products/analytics/:productId/purchase` - Track purchase

### Review Endpoints
- `GET /api/v1/products/reviews` - Get product reviews
- `POST /api/v1/products/reviews` - Create review (Auth required)
- `PUT /api/v1/products/reviews/:reviewId` - Update review (Auth required)
- `DELETE /api/v1/products/reviews/:reviewId` - Delete review (Auth required)
- `GET /api/v1/products/reviews/stats/:productId` - Get review statistics
- `POST /api/v1/products/reviews/:reviewId/helpful` - Mark review helpful

### Wishlist Endpoints
- `GET /api/v1/products/wishlist` - Get user wishlist (Auth required)
- `POST /api/v1/products/wishlist` - Add to wishlist (Auth required)
- `DELETE /api/v1/products/wishlist/:productId` - Remove from wishlist (Auth required)
- `GET /api/v1/products/wishlist/stats` - Get wishlist statistics (Auth required)
- `GET /api/v1/products/wishlist/recommendations` - Get recommendations (Auth required)

## 📊 Data Models

### Enhanced Product Model
```typescript
interface TProduct {
  title: string;
  description: string;
  shortDescription?: string;
  primaryImage: string;
  optionalImages?: string[];
  regularPrice: number;
  discountPrice: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  variants?: TProductVariant[];
  inventory: {
    totalStock: number;
    reservedStock: number;
    availableStock: number;
    lowStockThreshold: number;
    trackInventory: boolean;
  };
  status: 'active' | 'inactive' | 'draft' | 'archived';
  featured: boolean;
  seo?: TProductSEO;
  analytics?: TProductAnalytics;
  relatedProducts?: ObjectId[];
}
```

### Product Variants
```typescript
interface TProductVariant {
  sku: string;
  color: ObjectId;
  size: ObjectId;
  price: number;
  stock: number;
  images?: string[];
  isActive: boolean;
}
```

### Review Model
```typescript
interface TProductReview {
  productId: ObjectId;
  userId: ObjectId;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    response: string;
    respondedBy: ObjectId;
    respondedAt: Date;
  };
}
```

### Wishlist Model
```typescript
interface TProductWishlist {
  userId: ObjectId;
  productId: ObjectId;
  addedAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}
```

## 🔧 Usage Examples

### Creating a Product with Variants
```typescript
const product = await ProductModel.create({
  title: "Premium T-Shirt",
  description: "High-quality cotton t-shirt",
  primaryImage: "https://example.com/image.jpg",
  regularPrice: 29.99,
  discountPrice: 24.99,
  sku: "TSH-001",
  catagory: [categoryId],
  color: [colorIds],
  size: [sizeIds],
  variants: [
    {
      sku: "TSH-001-RED-M",
      color: redColorId,
      size: mediumSizeId,
      price: 24.99,
      stock: 50,
      isActive: true
    }
  ],
  inventory: {
    totalStock: 100,
    reservedStock: 0,
    availableStock: 100,
    lowStockThreshold: 10,
    trackInventory: true
  }
});
```

### Adding a Review
```typescript
const review = await ProductReviewService.createReview({
  productId: "productId",
  userId: "userId",
  userName: "John Doe",
  userEmail: "john@example.com",
  rating: 5,
  title: "Great product!",
  comment: "Really happy with this purchase",
  images: ["https://example.com/review1.jpg"]
});
```

### Managing Wishlist
```typescript
// Add to wishlist
await ProductWishlistService.addToWishlist(
  userId,
  productId,
  "Want this for birthday",
  "high"
);

// Get wishlist with filters
const wishlist = await ProductWishlistService.getWishlist({
  userId,
  priority: "high",
  page: 1,
  limit: 10,
  sortBy: "addedAt",
  sortOrder: "desc"
});
```

### Analytics Queries
```typescript
// Get product analytics
const analytics = await ProductAnalyticsService.getProductAnalytics({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31')
});

// Track product view
await ProductAnalyticsService.trackProductView(productId);

// Get inventory report
const inventoryReport = await ProductAnalyticsService.getInventoryReport();
```

## 🎯 Key Features

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Reserved stock for pending orders
- Inventory value calculations
- Stock turnover analysis

### SEO Optimization
- Automatic slug generation
- Meta title and description
- Canonical URLs
- Keyword management
- Search engine optimization

### Analytics & Insights
- Product performance metrics
- Sales analytics and trends
- Customer behavior tracking
- Conversion rate analysis
- Revenue optimization

### Review System
- 5-star rating system
- Image attachments
- Admin moderation
- Helpfulness voting
- Verified purchase reviews

### Wishlist Features
- Priority-based organization
- Personal notes
- Recommendation engine
- Cart integration
- Statistics tracking

## 🔒 Security & Validation

- Input validation with express-validator
- Authentication middleware for protected routes
- Role-based access control
- Data sanitization
- SQL injection prevention
- XSS protection

## 📈 Performance Optimizations

- Database indexing for fast queries
- Aggregation pipelines for analytics
- Caching strategies
- Lazy loading for large datasets
- Pagination for list endpoints
- Virtual fields for computed values

## 🧪 Testing

The module includes comprehensive test coverage for:
- Model validation
- Service functions
- Controller endpoints
- Error handling
- Edge cases

## 📝 Contributing

When adding new features:
1. Update the interface definitions
2. Add validation schemas
3. Implement service functions
4. Create controller methods
5. Add route definitions
6. Update documentation
7. Add tests

## 🔄 Integration with Order System

The product module is fully integrated with the order system:
- Order creation updates product analytics
- Inventory is reserved during checkout
- Purchase tracking updates product metrics
- Review verification based on purchase history
- Recommendation engine uses order data

This enhanced product module provides a complete e-commerce solution with advanced features for product management, customer engagement, and business intelligence.
