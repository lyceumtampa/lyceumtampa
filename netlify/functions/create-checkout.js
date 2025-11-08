// Netlify serverless function to create Stripe Checkout session
// This function needs to be deployed to Netlify to work

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { quantity = 1 } = JSON.parse(event.body);
        
        // Import Stripe (you'll need to install stripe package)
        // For Netlify, add this to package.json: "stripe": "^13.0.0"
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        // Get price ID from environment variable or use a default
        const priceId = process.env.STRIPE_PRICE_ID || 'price_YOUR_PRICE_ID_HERE';
        
        // Get the origin URL
        const origin = event.headers.origin || event.headers.referer?.split('/').slice(0, 3).join('/') || process.env.URL || 'https://your-site.netlify.app';
        
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/purchase-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/purchase.html`,
            metadata: {
                event_name: 'Lyceum Tampa Ticket',
                quantity: quantity.toString(),
            },
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                sessionId: session.id,
                url: session.url,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};

