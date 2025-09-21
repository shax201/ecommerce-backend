# Update Product API Documentation

## Overview
The update product API allows authenticated users with proper permissions to update existing products in the system.

## Endpoint Details

### URL
```
PUT /api/v1/products/:id
```

### Method
`PUT`

### Authentication
- **Required**: Yes
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`

### Permissions
- **Required Permission**: `products.update`
- **Middleware**: `requirePermission('products', 'update')`

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the product to update |

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Product title |
| `description` | string | No | Product description |
| `regularPrice` | number | No | Regular price of the product |
| `discountPrice` | number | No | Discounted price of the product |
| `primaryImage` | string | No | URL of the primary product image |
| `optionalImages` | string[] | No | Array of optional image URLs |
| `videoLink` | string | No | URL to product video |
| `catagory` | string[] | No | Array of category IDs |
| `color` | string[] | No | Array of color values or IDs |
| `size` | string[] | No | Array of size values or IDs |
| `productType` | string | No | Type of product (e.g., 'top_selling', 'new_arrival') |

## Request Example

```bash
curl -X PUT "http://localhost:5000/api/v1/products/60f7b3b3b3b3b3b3b3b3b3b3" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "title": "Updated Product Title",
    "description": "Updated product description with more details",
    "regularPrice": 1500,
    "discountPrice": 1200,
    "primaryImage": "https://example.com/updated-image.jpg",
    "optionalImages": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "videoLink": "https://youtube.com/watch?v=example",
    "catagory": ["60f7b3b3b3b3b3b3b3b3b3b4", "60f7b3b3b3b3b3b3b3b3b3b5"],
    "color": ["red", "blue", "green"],
    "size": ["S", "M", "L", "XL"],
    "productType": "top_selling"
  }'
```

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Updated Product Title",
    "description": "Updated product description with more details",
    "regularPrice": 1500,
    "discountPrice": 1200,
    "primaryImage": "https://example.com/updated-image.jpg",
    "optionalImages": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "videoLink": "https://youtube.com/watch?v=example",
    "catagory": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "title": "Category Name",
        "parent": null
      }
    ],
    "color": [
      { "color": "red" },
      { "color": "blue" },
      { "color": "green" }
    ],
    "size": [
      { "size": "S" },
      { "size": "M" },
      { "size": "L" },
      { "size": "XL" }
    ],
    "productType": "top_selling",
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T11:45:00.000Z",
    "__v": 0
  }
}
```

### Error Responses

#### 400 Bad Request - Invalid Data
```json
{
  "success": false,
  "message": "catagory must be an array of category IDs."
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### 403 Forbidden - Insufficient Permissions
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

#### 404 Not Found - Product Not Found
```json
{
  "success": false,
  "message": "Product not found."
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Implementation Details

### Controller Method
```typescript
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateProductData = req.body;
    
    // Validation
    if (updateProductData.catagory && !Array.isArray(updateProductData.catagory)) {
      return res.status(400).json({
        success: false,
        message: 'catagory must be an array of category IDs.',
      });
    }
    
    // Similar validation for color and size arrays...
    
    const result = await ProductServices.updateProductIntoDB(id, updateProductData);
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    // Error handling...
  }
};
```

### Service Method
```typescript
const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  // Handle color and size arrays
  // Transform string values to ObjectIds if needed
  // Update the product in database
  // Return transformed product data
};
```

## Features

### 1. Partial Updates
- Only provided fields are updated
- Existing fields remain unchanged if not provided

### 2. Array Validation
- Validates that `catagory`, `color`, and `size` are arrays
- Automatically creates color/size documents if they don't exist

### 3. Data Transformation
- Converts string color/size values to ObjectIds
- Populates related category, color, and size data
- Returns fully populated product object

### 4. Error Handling
- Comprehensive error handling for various scenarios
- Specific error messages for different validation failures
- Proper HTTP status codes

## Usage with Frontend

### Using Redux RTK Query
```typescript
import { useUpdateProductMutation } from '@/lib/features/products/productApi';

const [updateProduct, { isLoading, error, isSuccess }] = useUpdateProductMutation();

const handleUpdate = async (productId: string, updateData: any) => {
  try {
    const result = await updateProduct({
      id: productId,
      data: updateData
    }).unwrap();
    
    if (result.success) {
      console.log('Product updated:', result.data);
    }
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

### Using Fetch API
```typescript
const updateProduct = async (productId: string, updateData: any) => {
  try {
    const response = await fetch(`/api/v1/products/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

## Testing

### Test Script
A test script is available at `back-end/test-update-product.js` to verify the API functionality.

### Manual Testing
1. Create a product first using the create API
2. Use the returned product ID to test the update API
3. Verify the response and updated data

## Notes

- The API automatically updates the `updatedAt` timestamp
- Color and size values are automatically converted to ObjectIds
- The response includes populated category, color, and size data
- All validation is performed before database operations
- The API supports partial updates (only update provided fields)
