import Replicate from 'replicate';
import Stripe from 'stripe';
import { storePaymentData, storeWebhookEvent, storePaymentAttempt, updateOrderStatus } from './database.js';

// Initialize Replicate and Stripe lazily
let replicate = null;
let stripe = null;

// Initialize services
function initializeServices() {
    if (!replicate && globalThis.REPLICATE_API_TOKEN) {
        replicate = new Replicate({
            auth: globalThis.REPLICATE_API_TOKEN,
        });
    }
    
    if (!stripe && globalThis.STRIPE_SECRET_KEY) {
        stripe = new Stripe(globalThis.STRIPE_SECRET_KEY);
    }
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
function handleCORS(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders,
        });
    }
    return null;
}

// Parse multipart form data for file uploads
async function parseMultipartFormData(request) {
    const formData = await request.formData();
    const file = formData.get('image');
    const style = formData.get('style');
    
    if (!file) {
        throw new Error('No image provided');
    }
    
    return { file, style };
}

// Generate image with Replicate
async function handleGenerate(request) {
    try {
        initializeServices();
        
        if (!replicate) {
            throw new Error('Replicate service not initialized');
        }
        
        const { file, style } = await parseMultipartFormData(request);
        
        console.log('🎨 Starting Replicate InstantID generation with style:', style);

        // Convert uploaded image to base64 data URL
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const imageDataUrl = `data:${file.type};base64,${base64}`;

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

        return new Response(JSON.stringify({ url: imageUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });

    } catch (error) {
        console.error('❌ Generation error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate image',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}

// Create Stripe Checkout Session
async function handleCheckout(request) {
    try {
        initializeServices();
        
        if (!stripe) {
            throw new Error('Stripe service not initialized');
        }
        
        const { items, customerEmail } = await request.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return new Response(JSON.stringify({ error: 'No items provided' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
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
            success_url: `${new URL(request.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${new URL(request.url).origin}/cancel`,
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

        return new Response(JSON.stringify({
            sessionId: session.id,
            url: session.url
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });

    } catch (error) {
        console.error('❌ Stripe checkout session error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to create checkout session',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}

// Verify checkout session
async function handleVerifySession(request) {
    try {
        initializeServices();
        
        if (!stripe) {
            throw new Error('Stripe service not initialized');
        }
        
        const url = new URL(request.url);
        const sessionId = url.pathname.split('/').pop();

        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'Session ID is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'customer_details']
        });

        const response = {
            session_id: session.id,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email || session.customer_email,
            amount_total: session.amount_total,
            currency: session.currency,
            created: session.created,
            metadata: session.metadata,
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });

    } catch (error) {
        console.error('❌ Session verification error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to verify session',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}

// Stripe Webhook endpoint
async function handleWebhook(request) {
    initializeServices();
    
    if (!stripe) {
        throw new Error('Stripe service not initialized');
    }
    
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, globalThis.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message);
        return new Response(`Webhook Error: ${err.message}`, {
            status: 400,
        });
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
    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

// Main fetch handler
export default {
    async fetch(request, env, ctx) {
        // Set global environment variables
        globalThis.REPLICATE_API_TOKEN = env.REPLICATE_API_TOKEN;
        globalThis.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
        globalThis.STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
        globalThis.DATABASE_URL = env.DATABASE_URL;

        const url = new URL(request.url);
        
        // Handle CORS preflight
        const corsResponse = handleCORS(request);
        if (corsResponse) return corsResponse;

        // Route handling
        if (url.pathname === '/api/generate' && request.method === 'POST') {
            return await handleGenerate(request);
        }
        
        if (url.pathname === '/api/checkout' && request.method === 'POST') {
            return await handleCheckout(request);
        }
        
        if (url.pathname.startsWith('/api/verify-session/') && request.method === 'GET') {
            return await handleVerifySession(request);
        }
        
        if (url.pathname === '/api/stripe-webhook' && request.method === 'POST') {
            return await handleWebhook(request);
        }

        // 404 for unknown routes
        return new Response('Not Found', {
            status: 404,
            headers: corsHeaders,
        });
    },
};
