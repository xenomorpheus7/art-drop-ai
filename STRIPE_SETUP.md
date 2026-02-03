# Stripe Payment Integration Setup Guide

## Overview
This implementation provides a complete Stripe Checkout integration with support for multiple payment methods, webhooks, and database storage.

## Features Implemented

### Payment Methods
- Cards (Visa, Mastercard, Amex)
- Apple Pay
- Google Pay
- SEPA Direct Debit
- Klarna
- PayPal
- iDEAL
- Bancontact
- Giropay
- EPS
- Przelewy24
- Afterpay / Clearpay

### Key Features
- EUR base currency with multi-currency support
- Automatic payment method localization by country/device
- Server-side checkout session creation
- Webhook handling for payment confirmation
- Database storage for payment data
- Order management system
- Payment verification endpoint

## Setup Instructions

### 1. Install Dependencies
```bash
npm install stripe pg
```

### 2. Environment Variables
Update your `.env` file with your Stripe credentials:

```env
STRIPE_SECRET_KEY=sk_test_... (your test secret key)
STRIPE_PUBLISHABLE_KEY=pk_test_... (your test publishable key)
STRIPE_WEBHOOK_SECRET=whsec_... (your webhook secret)
DATABASE_URL=postgresql://... (your database connection)
```

### 3. Database Setup
Run the SQL schema in `database_schema.sql` to create the necessary tables:

```bash
psql -d your_database -f database_schema.sql
```

### 4. Stripe Dashboard Configuration

#### Enable Payment Methods
1. Go to Stripe Dashboard → Settings → Payment Methods
2. Enable all required payment methods:
   - Card payments (already enabled)
   - Apple Pay
   - Google Pay
   - SEPA Direct Debit
   - Klarna
   - PayPal
   - iDEAL
   - Bancontact
   - Giropay
   - EPS
   - Przelewy24
   - Afterpay / Clearpay

#### Configure Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. For local testing, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`

#### Currency Settings
1. Go to Stripe Dashboard → Settings → Payments
2. Set EUR as default currency
3. Enable multi-currency if needed

### 5. Server Configuration
The server is already configured with:
- Stripe checkout session creation endpoint
- Webhook handler with signature verification
- Payment verification endpoint
- Database integration

### 6. Frontend Integration
The frontend includes:
- Updated `CheckoutButton` component
- New `PaymentStatus` component for success pages
- Proper error handling and loading states

## API Endpoints

### Create Checkout Session
```
POST /api/create-checkout-session
Content-Type: application/json

{
  "items": [
    {
      "name": "Product Name",
      "description": "Product Description",
      "amount": 19.99,
      "quantity": 1,
      "images": []
    }
  ],
  "customerEmail": "customer@example.com",
  "metadata": {
    "style": "cyberpunk",
    "product": "digital"
  }
}
```

### Verify Payment Session
```
GET /api/verify-session/:sessionId
```

### Webhook Endpoint
```
POST /api/webhook
Stripe-Signature: [signature]
```

## Database Schema

### Tables Created
- `orders` - Main order information
- `order_items` - Individual order items
- `payment_attempts` - Payment attempt tracking
- `webhook_events` - Webhook event audit trail

## Testing

### Test Cards
Use these Stripe test cards for testing:
- Card Number: `4242424242424242` (Visa)
- Expiration: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Local Testing
1. Start your server: `npm run server`
2. Start your frontend: `npm run dev`
3. Use Stripe CLI for webhooks: `stripe listen --forward-to localhost:3001/api/webhook`

## Security Notes

- Always use HTTPS in production
- Never expose your secret key in frontend code
- Verify webhook signatures
- Store only necessary payment data
- Implement proper error handling

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Configure proper domain URLs
- [ ] Set up production webhooks
- [ ] Enable fraud protection
- [ ] Configure email notifications
- [ ] Set up monitoring and alerts
- [ ] Test all payment methods
- [ ] Verify tax calculations
- [ ] Test refund flows

## Support

For issues:
1. Check Stripe Dashboard logs
2. Review server logs
3. Verify webhook delivery
4. Test with different payment methods
