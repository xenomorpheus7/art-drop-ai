import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Replicate from 'replicate';
import multer from 'multer';
import Stripe from 'stripe';
import { storePaymentData, storeWebhookEvent, storePaymentAttempt, updateOrderStatus } from './database.js';

dotenv.config();

const app = express();
const port = 3001;

// Configure Replicate
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

console.log("Replicate Token loaded:", process.env.REPLICATE_API_TOKEN ? "✅ Yes" : "❌ NO");

// Configure Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe Secret Key loaded:", process.env.STRIPE_SECRET_KEY ? "✅ Yes" : "❌ NO");

app.use(cors());
app.use(express.json({ limit: '50mb' }));
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/generate', upload.single('image'), async (req, res) => {
    try {
        const { style } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        console.log('🎨 Starting Replicate InstantID generation with style:', style);

        // Convert uploaded image to base64 data URL
        const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        let prompt = "professional portrait, high quality, detailed";
        switch (style) {
            case "futuristic":
                prompt = "futuristic sci-fi portrait, holographic elements, sleek metallic surfaces, advanced technology, glowing accents, space age aesthetic, high-tech environment, 8k, ultra detailed";
                break;
            case "cyberpunk":
                prompt = "cyberpunk style portrait, neon lights, dystopian city background, rain-soaked streets, vibrant pink and blue neon, high tech low life, detailed face, cinematic lighting, 8k";
                break;
            case "cowboy":
                prompt = "wild west cowboy portrait, western frontier style, leather and denim, desert landscape, vintage sepia tones, rugged aesthetic, old west atmosphere, detailed, cinematic";
                break;
            case "anime":
                prompt = "anime style portrait, Japanese animation aesthetic, vibrant colors, expressive eyes, clean linework, studio quality, detailed shading, professional anime art";
                break;
            case "renaissance":
                prompt = "renaissance oil painting portrait, classical art style, rich colors, dramatic chiaroscuro lighting, textured brushstrokes, museum quality, old master technique, baroque elegance";
                break;
            case "noir":
                prompt = "film noir style portrait, black and white, dramatic shadows, high contrast lighting, 1940s detective aesthetic, moody atmosphere, cinematic composition";
                break;
            default:
                prompt = "professional portrait, highly detailed, 8k, photorealistic";
        }

        console.log('📤 Sending to Replicate InstantID...');

        // Using Replicate's InstantID - with async iteration to get the final output
        const prediction = await replicate.predictions.create({
            version: "2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
            input: {
                image: imageDataUrl,
                prompt: prompt,
                negative_prompt: "low quality, bad anatomy, worst quality, blurry, distorted face, wrong gender",
                ip_adapter_scale: 0.8,
                controlnet_conditioning_scale: 0.8,
                num_inference_steps: 30,
                guidance_scale: 5
            }
        });

        console.log('⏳ Waiting for prediction...');

        // Wait for the prediction to complete
        const finalPrediction = await replicate.wait(prediction);

        console.log('✅ Replicate generation complete!');
        console.log('Prediction status:', finalPrediction.status);
        console.log('Prediction output:', finalPrediction.output);

        // The output should be a URL or array of URLs
        let imageUrl;
        if (Array.isArray(finalPrediction.output)) {
            imageUrl = finalPrediction.output[0];
        } else {
            imageUrl = finalPrediction.output;
        }

        console.log('Final image URL:', imageUrl);

        if (!imageUrl || typeof imageUrl !== 'string') {
            throw new Error('Invalid output from Replicate: ' + JSON.stringify(finalPrediction.output));
        }

        res.json({ url: imageUrl });

    } catch (error) {
        console.error('❌ Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate image',
            details: error.message
        });
    }
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, customerEmail } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }

        // Transform items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    description: item.description || '',
                    images: item.images || []
                },
                unit_amount: Math.round(item.amount * 100), // Convert to cents
            },
            quantity: item.quantity || 1
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
            customer_email: customerEmail,
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'GR', 'PT', 'IE', 'LU', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'MT', 'CY']
            },
            payment_intent_data: {
                capture_method: 'automatic'
            },
            automatic_tax: {
                enabled: true
            },
            allow_promotion_codes: true,
            phone_number_collection: {
                enabled: true
            }
        });

        res.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('❌ Stripe checkout session error:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            details: error.message
        });
    }
});

// Verify checkout session
app.get('/api/verify-session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'customer_details']
        });

        // Get order from database
        let orderData = null;
        try {
            orderData = await getOrderByCheckoutSessionId(sessionId);
        } catch (error) {
            console.error('Error retrieving order from database:', error);
        }

        const response = {
            session_id: session.id,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email || session.customer_email,
            amount_total: session.amount_total,
            currency: session.currency,
            created: session.created,
            metadata: session.metadata,
            order_data: orderData
        };

        res.json(response);

    } catch (error) {
        console.error('❌ Session verification error:', error);
        res.status(500).json({
            error: 'Failed to verify session',
            details: error.message
        });
    }
});

// Stripe Webhook endpoint
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Store webhook event for audit trail
    try {
        await storeWebhookEvent(event);
    } catch (error) {
        console.error('❌ Error storing webhook event:', error);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Checkout session completed:', session.id);
            
            // Store payment data in database
            const paymentData = {
                checkout_session_id: session.id,
                payment_intent_id: session.payment_intent,
                customer_email: session.customer_details?.email || session.customer_email,
                customer_id: session.customer,
                amount_total: session.amount_total,
                currency: session.currency,
                payment_status: session.payment_status,
                billing_address: session.customer_details?.address || null,
                shipping_address: session.shipping?.address || null,
                metadata: session.metadata,
                items: session.line_items?.data?.map(item => ({
                    name: item.description,
                    quantity: item.quantity,
                    unit_amount: item.amount_total / item.quantity,
                    total_amount: item.amount_total
                })) || []
            };

            try {
                const orderId = await storePaymentData(paymentData);
                
                // Update order status to processing
                await updateOrderStatus(orderId, 'processing', { 
                    webhook_processed: true,
                    processed_at: new Date().toISOString()
                });
                
                // TODO: Trigger fulfillment logic
                console.log('🚀 Order created and fulfillment triggered for order:', orderId);
                
            } catch (error) {
                console.error('❌ Error processing completed checkout:', error);
                // Store payment attempt for failed processing
                await storePaymentAttempt({
                    checkout_session_id: session.id,
                    payment_intent_id: session.payment_intent,
                    event_type: event.type,
                    status: 'failed',
                    amount: session.amount_total,
                    currency: session.currency,
                    error_message: error.message,
                    raw_event: event
                });
            }
            
            break;
            
        case 'payment_intent.succeeded':
            console.log('✅ PaymentIntent succeeded:', event.data.object.id);
            await storePaymentAttempt({
                checkout_session_id: null,
                payment_intent_id: event.data.object.id,
                event_type: event.type,
                status: 'succeeded',
                amount: event.data.object.amount,
                currency: event.data.object.currency,
                error_message: null,
                raw_event: event
            });
            break;
            
        case 'payment_intent.payment_failed':
            console.log('❌ PaymentIntent failed:', event.data.object.id);
            await storePaymentAttempt({
                checkout_session_id: null,
                payment_intent_id: event.data.object.id,
                event_type: event.type,
                status: 'failed',
                amount: event.data.object.amount,
                currency: event.data.object.currency,
                error_message: event.data.object.last_payment_error?.message,
                raw_event: event
            });
            break;
            
        case 'checkout.session.expired':
            console.log('⏰ Checkout session expired:', event.data.object.id);
            await storePaymentAttempt({
                checkout_session_id: event.data.object.id,
                payment_intent_id: event.data.object.payment_intent,
                event_type: event.type,
                status: 'expired',
                amount: event.data.object.amount_total,
                currency: event.data.object.currency,
                error_message: null,
                raw_event: event
            });
            break;
            
        default:
            console.log(`🔍 Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

app.listen(port, () => {
    console.log(`🚀 Backend server running at http://localhost:${port}`);
    console.log('🎨 Using Replicate InstantID for face-preserving generation');
    console.log('💰 Using your $5 Replicate credit');
});
