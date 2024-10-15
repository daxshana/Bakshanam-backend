// paypalService.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment); // Use PayPalHttpClient instead of CoreClient


// Function to create an order
const createOrder = async (amount) => {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: amount,
                },
            },
        ],
    });

    const response = await client.execute(request);
    return response.result;
};

// Function to capture an order
const captureOrder = async (orderId) => {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute(request);
    return response.result;
};

module.exports = { createOrder, captureOrder };
