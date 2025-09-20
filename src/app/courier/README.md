# Multi-Courier Integration System

This module provides a unified interface for integrating with multiple courier services (Pathao, Steadfast) in the ecommerce backend.

## Features

- **Multi-Courier Support**: Easily switch between different courier providers
- **Credential Management**: Secure storage and management of courier API credentials
- **Factory Pattern**: Extensible architecture for adding new courier providers
- **OAuth Token Management**: Automatic token refresh for Pathao API
- **Order Tracking**: Real-time order status updates
- **Bulk Operations**: Support for creating multiple orders at once
- **Price Calculation**: Calculate delivery fees (Pathao only)

## Architecture

### Core Components

1. **CourierCredentialsService**: Manages courier API credentials
2. **CourierService**: Main service layer with factory pattern
3. **Adapters**: Courier-specific implementations
   - `PathaoAdapter`: Handles Pathao API integration
   - `SteadfastAdapter`: Handles Steadfast API integration

### Database Models

- **CourierCredentials**: Stores API credentials for each courier
- **OrderHistory**: Extended with courier tracking fields

## API Endpoints

### Credential Management
- `GET /api/v1/courier/credentials` - Get all credentials
- `GET /api/v1/courier/credentials/active` - Get active couriers
- `GET /api/v1/courier/credentials/:courier` - Get specific courier credentials
- `POST /api/v1/courier/credentials` - Create credentials
- `PUT /api/v1/courier/credentials/:courier` - Update credentials
- `PATCH /api/v1/courier/credentials/:courier/status` - Toggle credentials status
- `DELETE /api/v1/courier/credentials/:courier` - Delete credentials

### Courier Operations
- `GET /api/v1/courier/available` - Get available couriers
- `GET /api/v1/courier/validate/:courier` - Validate courier credentials
- `POST /api/v1/courier/:courier/order` - Create order
- `POST /api/v1/courier/:courier/bulk-order` - Create bulk orders
- `GET /api/v1/courier/:courier/status/:consignmentId` - Get order status
- `POST /api/v1/courier/:courier/calculate-price` - Calculate delivery price

### Order Integration
- `POST /api/v1/courier/orders/:orderId/create` - Create courier order from existing order
- `PATCH /api/v1/courier/orders/:orderId/status` - Update order status from courier
- `GET /api/v1/courier/orders/:orderId/tracking` - Get order tracking information

## Setup

### 1. Initialize Courier Providers
```bash
bun run init:courier
```

### 2. Configure Credentials

#### Pathao Credentials
```json
{
  "courier": "pathao",
  "credentials": {
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "username": "your_username",
    "password": "your_password",
    "base_url": "https://api-hermes.pathao.com"
  },
  "isActive": true
}
```

#### Steadfast Credentials
```json
{
  "courier": "steadfast",
  "credentials": {
    "api_key": "your_api_key",
    "secret_key": "your_secret_key",
    "base_url": "https://portal.packzy.com/api/v1"
  },
  "isActive": true
}
```

## Usage Examples

### Creating an Order
```typescript
const courierService = new CourierService();

const orderData = {
  orderNumber: "ORD-2024-ABC123",
  customerName: "John Doe",
  customerPhone: "+8801234567890",
  customerAddress: "123 Main St",
  customerCity: "Dhaka",
  customerArea: "Dhanmondi",
  items: [
    {
      name: "Product 1",
      quantity: 2,
      weight: 0.5,
      price: 1000
    }
  ],
  totalAmount: 1000,
  notes: "Handle with care"
};

const result = await courierService.createOrder('pathao', orderData);
```

### Getting Order Status
```typescript
const status = await courierService.getStatus('pathao', 'consignment_id_123');
```

### Calculating Price
```typescript
const price = await courierService.calculatePrice('pathao', {
  item_type: 2,
  item_weight: 0.5,
  item_quantity: 1,
  delivery_type: 48,
  recipient_city: "Dhaka",
  recipient_zone: "Dhanmondi"
});
```

## Adding New Couriers

To add a new courier provider:

1. Create a new adapter class implementing `ICourierAdapter`
2. Add the courier type to the `CourierType` union
3. Update the factory method in `CourierService`
4. Add courier-specific credential validation

Example:
```typescript
export class NewCourierAdapter implements ICourierAdapter {
  // Implement required methods
}

// In CourierService.getCourierAdapterWithCredentials()
case 'newcourier':
  return new NewCourierAdapter(credentials.credentials as INewCourierCredentials);
```

## Security

- Credentials are stored securely in the database
- OAuth tokens are automatically refreshed
- All API endpoints require proper authentication and permissions
- Input validation is enforced on all endpoints

## Error Handling

The system provides comprehensive error handling:
- Network errors are caught and returned as user-friendly messages
- Invalid credentials are detected and reported
- API rate limits are handled gracefully
- Validation errors provide detailed feedback

## Monitoring

- All courier operations are logged
- Failed operations are tracked for debugging
- Token expiry is monitored and handled automatically
- Order status updates are tracked in the database
