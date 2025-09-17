# User Settings Module

This module provides user settings functionality that allows authenticated users to manage their own profile information, including password changes, name updates, email updates, and preferences management.

## Features

### Core Functionality
- **Profile Management**: Update first name and last name
- **Email Management**: Change email address with password verification
- **Password Management**: Change password with current password verification
- **Phone Management**: Update phone number
- **Preferences Management**: Update language, currency, and notification preferences
- **Profile Viewing**: Get own profile information

### Security Features
- All endpoints require authentication (JWT token)
- Password verification required for sensitive operations (email/password changes)
- Input validation and sanitization
- Proper error handling and status codes

## API Endpoints

All endpoints require authentication via Bearer token in the Authorization header.

### Profile Management
- `GET /api/v1/user-settings/profile` - Get user's own profile
- `PUT /api/v1/user-settings/profile` - Update user's own profile (names only)

### Email Management
- `PUT /api/v1/user-settings/email` - Update user's own email address

### Password Management
- `PUT /api/v1/user-settings/password` - Change user's own password

### Phone Management
- `PUT /api/v1/user-settings/phone` - Update user's own phone number

### Preferences Management
- `GET /api/v1/user-settings/preferences` - Get user's own preferences
- `PUT /api/v1/user-settings/preferences` - Update user's own preferences

## Request/Response Examples

### Update Profile
```http
PUT /api/v1/user-settings/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}
```

### Update Email
```http
PUT /api/v1/user-settings/email
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "newEmail": "newemail@example.com",
  "currentPassword": "currentPassword123"
}
```

### Change Password
```http
PUT /api/v1/user-settings/password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### Update Phone
```http
PUT /api/v1/user-settings/phone
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

### Update Preferences
```http
PUT /api/v1/user-settings/preferences
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "language": "en",
  "currency": "USD",
  "notifications": true
}
```

## Response Format

All endpoints return responses in the following format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data (varies by endpoint)
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token, incorrect password)
- `404` - Not Found (user not found)
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Validation Rules

### Profile Updates
- First name: 2-50 characters
- Last name: 2-50 characters

### Email Updates
- Valid email format
- Current password required for verification
- Email must be unique

### Password Changes
- Current password required for verification
- New password: minimum 8 characters
- Must contain uppercase, lowercase, and number
- Confirm password must match new password

### Phone Updates
- 10-15 characters (optional)

### Preferences
- Language: 2-10 characters (optional)
- Currency: 3-10 characters (optional)
- Notifications: boolean (optional)

## Security Notes

1. All sensitive operations require current password verification
2. Email changes reset the email verification status
3. Passwords are hashed using bcrypt with salt rounds of 12
4. JWT tokens are required for all operations
5. Input validation prevents malicious data injection
