# API Documentation

Loconomy provides a comprehensive RESTful API for integrating with our platform. This documentation covers authentication, endpoints, request/response formats, and best practices.

## 🔗 Base URL

```
Production: https://api.loconomy.com/v2
Staging: https://staging-api.loconomy.com/v2
```

## 🔐 Authentication

### API Keys

All API requests require authentication using an API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.loconomy.com/v2/providers
```

### OAuth 2.0

For user-specific actions, use OAuth 2.0:

```javascript
// Authorization URL
https://loconomy.com/oauth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read:profile,write:bookings
```

### Rate Limiting

- **Standard**: 1,000 requests per hour
- **Premium**: 10,000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 👥 Users API

### Get User Profile

```http
GET /users/{userId}
```

**Response:**
```json
{
  "id": "usr_123456789",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatar": "https://cdn.loconomy.com/avatars/user123.jpg",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  },
  "isVerified": true,
  "joinedAt": "2023-01-15T08:00:00Z",
  "preferences": {
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "privacy": {
      "profileVisibility": "public",
      "showLocation": true
    }
  }
}
```

### Update User Profile

```http
PATCH /users/{userId}
```

**Request:**
```json
{
  "displayName": "Jane Doe",
  "location": {
    "city": "Los Angeles",
    "state": "CA"
  },
  "preferences": {
    "notifications": {
      "email": false,
      "push": true
    }
  }
}
```

---

## 🏢 Providers API

### List Providers

```http
GET /providers?location={location}&category={category}&limit={limit}&offset={offset}
```

**Parameters:**
- `location` (string): City, state, or coordinates
- `category` (string): Service category slug
- `limit` (integer): Number of results (1-100, default: 20)
- `offset` (integer): Pagination offset (default: 0)
- `sort` (string): Sort by `distance`, `rating`, `price` (default: `distance`)

**Response:**
```json
{
  "data": [
    {
      "id": "prv_123456789",
      "businessName": "Elite Cleaning Services",
      "displayName": "Sarah Johnson",
      "avatar": "https://cdn.loconomy.com/avatars/provider123.jpg",
      "category": {
        "id": "cat_cleaning",
        "name": "Cleaning Services",
        "slug": "cleaning"
      },
      "rating": {
        "average": 4.8,
        "count": 127
      },
      "pricing": {
        "startingPrice": 75,
        "currency": "USD",
        "unit": "hour"
      },
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "distance": 2.5
      },
      "isVerified": true,
      "isOnline": true,
      "responseTime": "within 1 hour",
      "services": [
        {
          "id": "svc_residential_cleaning",
          "name": "Residential Cleaning",
          "price": 75
        }
      ]
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Provider Details

```http
GET /providers/{providerId}
```

**Response:**
```json
{
  "id": "prv_123456789",
  "businessName": "Elite Cleaning Services",
  "displayName": "Sarah Johnson",
  "bio": "Professional cleaning service with 10+ years experience...",
  "avatar": "https://cdn.loconomy.com/avatars/provider123.jpg",
  "coverPhoto": "https://cdn.loconomy.com/covers/provider123.jpg",
  "category": {
    "id": "cat_cleaning",
    "name": "Cleaning Services",
    "slug": "cleaning"
  },
  "rating": {
    "average": 4.8,
    "count": 127,
    "breakdown": {
      "5": 85,
      "4": 30,
      "3": 8,
      "2": 3,
      "1": 1
    }
  },
  "pricing": {
    "startingPrice": 75,
    "currency": "USD",
    "unit": "hour"
  },
  "location": {
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "US",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    },
    "serviceRadius": 25
  },
  "contact": {
    "phone": "+1-555-0123",
    "email": "sarah@elitecleaning.com",
    "website": "https://elitecleaning.com"
  },
  "verification": {
    "isVerified": true,
    "backgroundCheck": true,
    "insuranceVerified": true,
    "licenseVerified": true
  },
  "availability": {
    "timezone": "America/Los_Angeles",
    "schedule": {
      "monday": { "start": "08:00", "end": "18:00" },
      "tuesday": { "start": "08:00", "end": "18:00" },
      "wednesday": { "start": "08:00", "end": "18:00" },
      "thursday": { "start": "08:00", "end": "18:00" },
      "friday": { "start": "08:00", "end": "18:00" },
      "saturday": { "start": "09:00", "end": "16:00" },
      "sunday": null
    }
  },
  "services": [
    {
      "id": "svc_residential_cleaning",
      "name": "Residential Cleaning",
      "description": "Complete home cleaning service",
      "price": 75,
      "duration": 120,
      "unit": "hour"
    }
  ],
  "portfolio": [
    {
      "id": "img_123",
      "url": "https://cdn.loconomy.com/portfolio/provider123_1.jpg",
      "caption": "Living room cleaning"
    }
  ],
  "certifications": [
    {
      "name": "Certified Professional Cleaner",
      "issuer": "Cleaning Industry Association",
      "issuedAt": "2022-06-15",
      "expiresAt": "2025-06-15"
    }
  ]
}
```

---

## 📅 Bookings API

### Create Booking

```http
POST /bookings
```

**Request:**
```json
{
  "providerId": "prv_123456789",
  "serviceId": "svc_residential_cleaning",
  "scheduledFor": "2024-02-15T10:00:00Z",
  "duration": 120,
  "location": {
    "address": "456 Oak Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94103",
    "instructions": "Apartment 4B, buzz unit 4B"
  },
  "notes": "Please focus on kitchen and bathrooms",
  "pricing": {
    "basePrice": 150,
    "tips": 20,
    "taxes": 13.50,
    "total": 183.50
  }
}
```

**Response:**
```json
{
  "id": "bkg_123456789",
  "status": "pending",
  "providerId": "prv_123456789",
  "customerId": "usr_123456789",
  "service": {
    "id": "svc_residential_cleaning",
    "name": "Residential Cleaning"
  },
  "scheduledFor": "2024-02-15T10:00:00Z",
  "duration": 120,
  "location": {
    "address": "456 Oak Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94103",
    "instructions": "Apartment 4B, buzz unit 4B"
  },
  "notes": "Please focus on kitchen and bathrooms",
  "pricing": {
    "basePrice": 150,
    "tips": 20,
    "taxes": 13.50,
    "total": 183.50,
    "currency": "USD"
  },
  "payment": {
    "method": "card_ending_4242",
    "status": "authorized"
  },
  "createdAt": "2024-02-10T14:30:00Z",
  "updatedAt": "2024-02-10T14:30:00Z"
}
```

### List Bookings

```http
GET /bookings?status={status}&limit={limit}&offset={offset}
```

**Parameters:**
- `status` (string): `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`
- `providerId` (string): Filter by provider
- `customerId` (string): Filter by customer
- `from` (string): Start date (ISO 8601)
- `to` (string): End date (ISO 8601)

### Update Booking Status

```http
PATCH /bookings/{bookingId}
```

**Request:**
```json
{
  "status": "confirmed",
  "providerNotes": "Confirmed for Thursday morning"
}
```

---

## ⭐ Reviews API

### Create Review

```http
POST /reviews
```

**Request:**
```json
{
  "bookingId": "bkg_123456789",
  "rating": 5,
  "title": "Excellent service!",
  "content": "Sarah did an amazing job cleaning our home. Very professional and thorough.",
  "photos": [
    "https://cdn.loconomy.com/reviews/review123_1.jpg"
  ],
  "wouldRecommend": true
}
```

### List Reviews

```http
GET /reviews?providerId={providerId}&limit={limit}&offset={offset}
```

---

## 💳 Payments API

### Process Payment

```http
POST /payments
```

**Request:**
```json
{
  "bookingId": "bkg_123456789",
  "paymentMethodId": "pm_123456789",
  "amount": 18350,
  "currency": "USD",
  "description": "Residential cleaning service"
}
```

### Get Payment Methods

```http
GET /payment-methods
```

---

## 📊 Analytics API

### Provider Analytics

```http
GET /analytics/providers/{providerId}?period={period}
```

**Parameters:**
- `period` (string): `day`, `week`, `month`, `quarter`, `year`
- `from` (string): Start date (ISO 8601)
- `to` (string): End date (ISO 8601)

**Response:**
```json
{
  "period": "month",
  "from": "2024-01-01T00:00:00Z",
  "to": "2024-01-31T23:59:59Z",
  "metrics": {
    "totalBookings": 45,
    "completedBookings": 42,
    "cancelledBookings": 3,
    "revenue": {
      "gross": 3150.00,
      "net": 2677.50,
      "fees": 472.50,
      "currency": "USD"
    },
    "averageRating": 4.8,
    "responseRate": 0.95,
    "averageResponseTime": 1800
  },
  "trends": {
    "bookingsGrowth": 0.15,
    "revenueGrowth": 0.22,
    "ratingTrend": 0.02
  }
}
```

---

## 🔔 Webhooks

### Event Types

- `booking.created`
- `booking.confirmed`
- `booking.completed`
- `booking.cancelled`
- `payment.succeeded`
- `payment.failed`
- `review.created`
- `provider.verified`

### Webhook Payload

```json
{
  "id": "evt_123456789",
  "type": "booking.created",
  "created": 1640995200,
  "data": {
    "object": {
      "id": "bkg_123456789",
      "status": "pending",
      // ... booking object
    }
  }
}
```

### Webhook Verification

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const computedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(computedSignature, 'hex')
  );
}
```

---

## 🔄 Pagination

All list endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true,
    "next": "/providers?offset=20&limit=20",
    "previous": null
  }
}
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "error": {
    "type": "validation_error",
    "code": "INVALID_PARAMETER",
    "message": "The 'email' parameter is required",
    "details": {
      "parameter": "email",
      "reason": "missing_required_parameter"
    },
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Types

- `authentication_error` - Invalid API key or token
- `authorization_error` - Insufficient permissions
- `validation_error` - Invalid request parameters
- `rate_limit_error` - Too many requests
- `resource_not_found` - Requested resource doesn't exist
- `api_error` - Internal server error

---

## 📱 SDK Libraries

### JavaScript/Node.js

```bash
npm install @loconomy/sdk
```

```javascript
import { Loconomy } from '@loconomy/sdk';

const loconomy = new Loconomy({
  apiKey: 'your_api_key',
  environment: 'production' // or 'staging'
});

// List providers
const providers = await loconomy.providers.list({
  location: 'San Francisco, CA',
  category: 'cleaning',
  limit: 10
});

// Create booking
const booking = await loconomy.bookings.create({
  providerId: 'prv_123456789',
  serviceId: 'svc_residential_cleaning',
  scheduledFor: '2024-02-15T10:00:00Z',
  // ... other parameters
});
```

### Python

```bash
pip install loconomy-python
```

```python
import loconomy

client = loconomy.Client(
    api_key='your_api_key',
    environment='production'
)

# List providers
providers = client.providers.list(
    location='San Francisco, CA',
    category='cleaning',
    limit=10
)

# Create booking
booking = client.bookings.create(
    provider_id='prv_123456789',
    service_id='svc_residential_cleaning',
    scheduled_for='2024-02-15T10:00:00Z'
)
```

### PHP

```bash
composer require loconomy/php-sdk
```

```php
use Loconomy\Client;

$loconomy = new Client([
    'api_key' => 'your_api_key',
    'environment' => 'production'
]);

// List providers
$providers = $loconomy->providers->list([
    'location' => 'San Francisco, CA',
    'category' => 'cleaning',
    'limit' => 10
]);
```

---

## 🧪 Testing

### Sandbox Environment

Use our sandbox for testing:

```
Base URL: https://sandbox-api.loconomy.com/v2
API Key: sk_test_your_test_key
```

### Test Data

Sandbox includes test providers, users, and services for comprehensive testing.

### Webhooks Testing

Use webhook testing tools:
- [ngrok](https://ngrok.com/) for local development
- [Webhook.site](https://webhook.site/) for quick testing

---

## 📊 API Versioning

- **Current Version**: v2
- **Previous Version**: v1 (deprecated, sunset June 1, 2024)
- **Version Header**: `X-API-Version: 2`

### Migration Guide

See our [Migration Guide](docs/API_MIGRATION.md) for upgrading from v1 to v2.

---

## 🔒 Security Best Practices

1. **Keep API keys secure** - Never expose in client-side code
2. **Use HTTPS** for all requests
3. **Implement rate limiting** in your applications
4. **Validate webhook signatures** to prevent tampering
5. **Use least privilege** - request only necessary scopes
6. **Rotate API keys** regularly
7. **Monitor API usage** for unusual patterns

---

## 📞 Support

### API Support

- **Documentation**: [docs.loconomy.com/api](https://docs.loconomy.com/api)
- **API Status**: [status.loconomy.com](https://status.loconomy.com)
- **Support Email**: [api-support@loconomy.com](mailto:api-support@loconomy.com)
- **Discord**: [#api-help channel](https://discord.gg/loconomy)

### Rate Limits & Billing

- **Billing Questions**: [billing@loconomy.com](mailto:billing@loconomy.com)
- **Enterprise Sales**: [sales@loconomy.com](mailto:sales@loconomy.com)

---

*This API documentation is regularly updated. For the latest changes, see our [Changelog](CHANGELOG.md) or subscribe to our [API Newsletter](https://loconomy.com/api/newsletter).*