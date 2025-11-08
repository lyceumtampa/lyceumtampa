// Netlify serverless function to verify Stripe Checkout session
// This is used to verify payment on the success page

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const sessionId = event.queryStringParameters?.session_id;
        
        if (!sessionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Session ID is required' })
            };
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        // Retrieve the session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                session: {
                    id: session.id,
                    payment_status: session.payment_status,
                    amount_total: session.amount_total,
                    currency: session.currency,
                    customer_email: session.customer_details?.email,
                },
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

