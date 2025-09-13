# Sellora Auth & Credit API Endpoints

## Authentication Endpoints

### POST /api/auth/signup
```json
// Request
{
    "email": "user@example.com",
    "password": "securepassword123"
}

// Response 200 OK
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": "user_123",
        "email": "user@example.com",
        "name": null,
        "credits": 3,
        "createdAt": "2024-01-15T10:30:45.123Z"
    }
}
```

### POST /api/auth/signin
```json
// Request
{
    "email": "user@example.com",
    "password": "securepassword123"
}

// Response 200 OK
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": "user_123",
        "email": "user@example.com",
        "name": "John Doe",
        "credits": 5,
        "subscription": {
            "status": "active",
            "plan": "pro"
        }
    }
}
```

### POST /api/auth/magic-link
```json
// Request
{
    "email": "user@example.com"
}

// Response 200 OK
{
    "success": true,
    "message": "Magic link sent to user@example.com"
}
```

## Credit Management

### GET /api/credits
```json
// Response 200 OK
{
    "success": true,
    "credits": 5,
    "history": [
        {
            "id": "credit_123",
            "type": "add",
            "amount": 10,
            "description": "Monthly subscription credits",
            "date": "2024-01-15T10:30:45.123Z"
        },
        {
            "id": "credit_122",
            "type": "subtract",
            "amount": 1,
            "description": "Image enhancement",
            "date": "2024-01-14T15:20:30.456Z"
        }
    ]
}
```

### POST /api/consume-credit
```json
// Request
{
    "jobId": "job_123",
    "type": "enhancement"
}

// Response 200 OK
{
    "success": true,
    "creditsRemaining": 4,
    "transaction": {
        "id": "transaction_123",
        "amount": 1,
        "type": "subtract",
        "description": "Image enhancement",
        "date": "2024-01-15T10:30:45.123Z"
    }
}

// Response 402 Payment Required
{
    "success": false,
    "message": "Insufficient credits",
    "requiredCredits": 1,
    "availableCredits": 0
}
```

## Checkout & Subscription

### POST /api/checkout
```json
// Request
{
    "plan": "monthly",
    "priceId": "price_H5UGYm7tOvfxSV",
    "returnUrl": "https://sellora.com/account"
}

// Response 200 OK
{
    "success": true,
    "sessionId": "cs_test_...",
    "sessionUrl": "https://checkout.stripe.com/..."
}
```

### GET /api/subscription
```json
// Response 200 OK
{
    "success": true,
    "subscription": {
        "id": "sub_123",
        "status": "active",
        "plan": "pro",
        "price": 19.99,
        "monthlyCredits": 50,
        "nextBilling": "2024-02-15T10:30:45.123Z",
        "cancelAtPeriodEnd": false
    }
}
```

### POST /api/subscription/cancel
```json
// Response 200 OK
{
    "success": true,
    "subscription": {
        "id": "sub_123",
        "status": "active",
        "cancelAtPeriodEnd": true,
        "currentPeriodEnd": "2024-02-15T10:30:45.123Z"
    }
}
```

## Stripe Integration

### Environment Variables
```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Price Configuration
```javascript
const prices = {
    credits: {
        '5_credits': 'price_H5UGYm7tOvfxSV',
        '10_credits': 'price_H5UGYm7tOvfxSW',
        '20_credits': 'price_H5UGYm7tOvfxSX'
    },
    subscription: {
        basic: 'price_H5UGYm7tOvfxSY',
        pro: 'price_H5UGYm7tOvfxSZ',
        business: 'price_H5UGYm7tOvfxS0'
    }
};
```

### Webhook Events
```javascript
const webhookEvents = {
    'checkout.session.completed': handleCheckoutComplete,
    'customer.subscription.updated': handleSubscriptionUpdate,
    'customer.subscription.deleted': handleSubscriptionCancel,
    'invoice.payment_succeeded': handlePaymentSuccess,
    'invoice.payment_failed': handlePaymentFailure
};
```

### Example Webhook Handler
```javascript
async function handleCheckoutComplete(event) {
    const session = event.data.object;
    
    // Add credits or activate subscription
    if (session.mode === 'payment') {
        // One-time credit purchase
        await addCreditsToUser(session.client_reference_id, session.metadata.credits);
    } else if (session.mode === 'subscription') {
        // Subscription activation
        await activateSubscription(session.client_reference_id, session.subscription);
    }
}
```

## Credit System Implementation

### Credit Types
```javascript
const creditTypes = {
    FREE_SIGNUP: {
        amount: 3,
        description: 'Welcome credits'
    },
    ENHANCEMENT: {
        amount: -1,
        description: 'Image enhancement'
    },
    SUBSCRIPTION_MONTHLY: {
        amount: 50,
        description: 'Monthly subscription credits'
    }
};
```

### Credit Transaction
```javascript
async function createCreditTransaction(userId, type, metadata = {}) {
    const transaction = {
        userId,
        type,
        amount: creditTypes[type].amount,
        description: creditTypes[type].description,
        metadata,
        date: new Date()
    };

    // Update user credits
    await db.users.updateCredits(userId, transaction.amount);

    // Log transaction
    await db.creditTransactions.create(transaction);

    return transaction;
}
```

### Subscription Benefits
```javascript
const subscriptionBenefits = {
    basic: {
        monthlyCredits: 20,
        features: ['High-resolution downloads', 'All styles']
    },
    pro: {
        monthlyCredits: 50,
        features: ['High-resolution downloads', 'All styles', 'Priority processing']
    },
    business: {
        monthlyCredits: Infinity,
        features: ['Unlimited credits', 'API access', 'Priority support']
    }
};
```

## Security Considerations

### JWT Configuration
```javascript
const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'sellora.com'
};
```

### Rate Limiting
```javascript
const rateLimits = {
    'auth/signin': {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5 // 5 attempts
    },
    'auth/magic-link': {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3 // 3 attempts
    }
};
```

### Magic Link Configuration
```javascript
const magicLinkConfig = {
    expiresIn: '15m',
    usages: 1,
    length: 32
};
```

## Error Handling

### Common Error Responses
```javascript
const errorResponses = {
    AUTH_FAILED: {
        code: 401,
        message: 'Authentication failed'
    },
    INSUFFICIENT_CREDITS: {
        code: 402,
        message: 'Insufficient credits'
    },
    INVALID_SUBSCRIPTION: {
        code: 403,
        message: 'Invalid or expired subscription'
    }
};
```

### Error Handler
```javascript
function handleApiError(error, req, res, next) {
    console.error('API Error:', error);

    const response = {
        success: false,
        message: error.message || 'Internal server error',
        code: error.code || 500
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    res.status(response.code).json(response);
}
```
