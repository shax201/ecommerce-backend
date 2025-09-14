# Order Module API Documentation

## Overview
The Order Module provides comprehensive order management functionality including order creation, tracking, analytics, and shipping address management.

## Base URL
```
/api/v1
```

## Authentication
Most endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Order Management

### Create Order
**POST** `/order`

Create a new order.

**Request Body:**
```json
{
  "productID": ["60f7b3b3b3b3b3b3b3b3b3b3"],
  "quantity": 2,
  "totalPrice": 199.99,
  "paymentMethod": "credit_card",
  "shipping": "60f7b3b3b3b3b3b3b3b3b3b3b3",
  "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
  "notes": "Please handle with care"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3b3",
    "orderNumber": "ORD-2024-ABC123",
    "status": "pending",
    "trackingSteps": ["pending"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Order by ID
**GET** `/order/:id`

Retrieve a specific order by ID.

**Response:**
```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3b3",
    "orderNumber": "ORD-2024-ABC123",
    "status": "processing",
    "totalPrice": 199.99,
    "products": [...],
    "client": {...},
    "shipping": {...}
  }
}
```

### Update Order
**PUT** `/order/:id`

Update an existing order.

**Request Body:**
```json
{
  "trackingSteps": ["pending", "processing"],
  "paymentStatus": true,
  "notes": "Updated notes"
}
```

### Delete Order
**DELETE** `/order/:id`

Delete an order.

### Update Order Status
**PATCH** `/order/:id/status`

Update the status of an order.

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Order has been shipped"
}
```

### Get My Orders
**GET** `/order/my/orders`

Get orders for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `search` (optional): Search term
- `category` (optional): Filter by category
- `sort` (optional): Sort order (date-desc, date-asc, total-desc, total-asc)

### Get My Analytics
**GET** `/order/my/analytics`

Get analytics for the authenticated user.

## Shipping Address Management

### Create Shipping Address
**POST** `/shipping`

Create a new shipping address.

**Request Body:**
```json
{
  "name": "John Doe",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "phone": 1234567890,
  "isDefault": true
}
```

### Get Shipping Addresses
**GET** `/shipping`

Get all shipping addresses for the authenticated user.

### Get Shipping Address by ID
**GET** `/shipping/:id`

Get a specific shipping address.

### Update Shipping Address
**PUT** `/shipping/:id`

Update a shipping address.

### Set Default Shipping Address
**PATCH** `/shipping/:id/default`

Set an address as the default shipping address.

### Delete Shipping Address
**DELETE** `/shipping/:id`

Delete a shipping address.

## Order Tracking

### Get Order Tracking
**GET** `/tracking/track/:id`

Get tracking information for an order.

**Response:**
```json
{
  "success": true,
  "message": "Tracking information retrieved successfully",
  "data": {
    "orderId": "60f7b3b3b3b3b3b3b3b3b3b3b3",
    "orderNumber": "ORD-2024-ABC123",
    "currentStatus": "shipped",
    "trackingSteps": ["pending", "processing", "shipped"],
    "events": [
      {
        "status": "pending",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "location": "Order Processing Center",
        "notes": "Your order has been received and is being prepared"
      }
    ],
    "estimatedDelivery": "2024-01-15T00:00:00.000Z",
    "lastUpdated": "2024-01-05T00:00:00.000Z"
  }
}
```

### Get Orders by Status
**GET** `/tracking/status/:status`

Get orders filtered by status.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Tracking Statistics
**GET** `/tracking/stats`

Get overall tracking statistics.

### Bulk Tracking
**POST** `/tracking/bulk`

Get tracking information for multiple orders.

**Request Body:**
```json
{
  "orderIds": ["60f7b3b3b3b3b3b3b3b3b3b3b3", "60f7b3b3b3b3b3b3b3b3b3b3b4"]
}
```

### Update Order Status
**PATCH** `/tracking/:id/status`

Update order status (admin only).

## Analytics

### Get Order Analytics
**GET** `/analytics/overview`

Get comprehensive order analytics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "message": "Order analytics retrieved successfully",
  "data": {
    "totalOrders": 150,
    "totalRevenue": 25000.00,
    "averageOrderValue": 166.67,
    "ordersByStatus": {
      "pending": 10,
      "processing": 15,
      "shipped": 20,
      "delivered": 100,
      "cancelled": 5
    },
    "ordersByMonth": [...],
    "topProducts": [...],
    "customerMetrics": {...},
    "paymentMethodDistribution": {...},
    "deliveryPerformance": {...}
  }
}
```

### Get Sales Trends
**GET** `/analytics/trends`

Get sales trends over time.

**Query Parameters:**
- `period` (optional): daily, weekly, monthly (default: monthly)
- `startDate` (optional): Start date
- `endDate` (optional): End date

### Get Customer Analytics
**GET** `/analytics/customers`

Get customer-related analytics.

### Get Product Analytics
**GET** `/analytics/products`

Get product performance analytics.

### Get Revenue Report
**GET** `/analytics/revenue`

Get detailed revenue report.

### Get Dashboard Data
**GET** `/analytics/dashboard`

Get comprehensive dashboard data.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `INVALID_ID`: Invalid ID format
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access forbidden
- `CONFLICT`: Resource conflict
- `INTERNAL_ERROR`: Server error

## Validation Rules

### Order Creation
- `productID`: Array of valid ObjectIds, at least one required
- `quantity`: Positive integer
- `totalPrice`: Non-negative number
- `paymentMethod`: Must be one of: credit_card, debit_card, paypal, stripe, cash_on_delivery
- `shipping`: Valid ObjectId

### Shipping Address
- `name`: Required string
- `address`: Required string
- `city`: Required string
- `state`: Required string
- `zip`: Required string
- `country`: Required string
- `phone`: Required numeric value

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Examples

### Complete Order Flow
1. Create shipping address: `POST /shipping`
2. Create order: `POST /order`
3. Track order: `GET /tracking/track/:id`
4. Update status: `PATCH /tracking/:id/status`
5. View analytics: `GET /analytics/overview`

### Error Handling Example
```javascript
try {
  const response = await fetch('/api/v1/order', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    console.error('Error:', result.message);
    console.error('Code:', result.code);
  }
} catch (error) {
  console.error('Network error:', error);
}
```
