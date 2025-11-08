# Stripe Payment Setup Guide

This guide will help you set up Stripe payments for your Lyceum Tampa ticket purchase page.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your site deployed on Netlify
3. Access to Netlify dashboard for environment variables

## Step 1: Create a Product and Price in Stripe

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Products** → **Add product**
3. Fill in the product details:
   - **Name**: Lyceum Tampa Event Ticket
   - **Description**: Access to exclusive Lyceum Tampa events
   - **Pricing**: Set your price (e.g., $25.00)
   - **Billing**: One-time
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

## Step 2: Get Your Stripe API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for testing, `pk_live_` for production)
3. Copy your **Secret key** (starts with `sk_test_` for testing, `sk_live_` for production)
   - ⚠️ **Keep your secret key secure! Never share it publicly.**

## Step 3: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**

### Add First Variable: Stripe Secret Key

**Key field:** 
```
STRIPE_SECRET_KEY
```

**Scopes field:**
- Leave the default selections (or select all: Build, Deploy, Runtime)
- This ensures the variable is available everywhere

**Values field:**
```
sk_test_YOUR_SECRET_KEY_HERE
```
(Paste your Stripe secret key from Step 2)

Click **Save**

### Add Second Variable: Stripe Price ID

**Key field:**
```
STRIPE_PRICE_ID
```

**Scopes field:**
- Leave the default selections (or select all: Build, Deploy, Runtime)

**Values field:**
```
price_YOUR_PRICE_ID_HERE
```
(Paste your Stripe price ID from Step 1)

Click **Save**

### Summary:
- **Key** = The variable name (exactly as shown: `STRIPE_SECRET_KEY` or `STRIPE_PRICE_ID`)
- **Scopes** = Leave defaults (ensures variable is available)
- **Values** = Your actual Stripe key or price ID (the secret value)

⚠️ **Important:** Never share your secret keys publicly. They are securely stored in Netlify.

## Step 4: Install Dependencies

Netlify will automatically install dependencies from `package.json` when deploying. However, if you want to test locally:

```bash
npm install
```

## Step 5: Update Netlify Function URLs (if needed)

The purchase page calls `/.netlify/functions/create-checkout`. This will work automatically once:
- The `netlify/functions` directory is at the root of your repository
- The functions are deployed to Netlify

## Step 6: Test Your Payment Flow

1. **Test Mode**: Use Stripe test cards
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. Visit your purchase page and test the checkout flow

3. Check Stripe Dashboard → **Payments** to see test transactions

## Step 7: Go Live

When you're ready to accept real payments:

1. Switch to **Live mode** in Stripe Dashboard
2. Get your live API keys (starts with `pk_live_` and `sk_live_`)
3. Update the environment variables in Netlify with live keys
4. Update the price ID if you created a new product for live mode
5. Redeploy your site

## Troubleshooting

### Payment button doesn't work
- Check browser console for errors
- Verify Netlify functions are deployed
- Check that environment variables are set correctly

### "Failed to create checkout session" error
- Verify `STRIPE_SECRET_KEY` is set in Netlify
- Verify `STRIPE_PRICE_ID` is set in Netlify
- Check Netlify function logs in the dashboard

### Functions not found
- Ensure `netlify/functions` directory is at repository root
- Verify functions are committed to git
- Check that Netlify is building from the correct branch

## Security Notes

- Never commit your Stripe secret keys to git
- Always use environment variables for sensitive data
- Test thoroughly in test mode before going live
- Set up webhooks to handle payment confirmations (optional but recommended)

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Stripe Testing](https://stripe.com/docs/testing)

## Support

If you need help:
1. Check Stripe Dashboard for payment logs
2. Check Netlify function logs
3. Review browser console for errors
4. Contact Stripe support if needed

