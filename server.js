/**
 * MUNAF Trading - Backend Server for Tracking
 * Handles server-side event tracking and Facebook Pixel integration
 * 
 * Setup:
 * 1. npm install express cors dotenv axios
 * 2. Create .env file
 * 3. node server.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Environment Variables
const FACEBOOK_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || '997816049561584';
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || 'your_access_token_here';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// In-memory storage (Use database like MongoDB in production)
const events = [];

/**
 * Send event to Facebook Pixel (Server-side)
 */
async function sendToFacebookPixel(eventData) {
    try {
        const pixelEvent = {
            data: [{
                event_name: eventData.eventType,
                event_time: Math.floor(new Date(eventData.timestamp).getTime() / 1000),
                user_data: {
                    client_ip_address: eventData.userIp,
                    client_user_agent: eventData.userAgent,
                },
                custom_data: {
                    content_name: 'Telegram Join',
                    content_category: 'Elite Trading Community',
                    value: 1,
                    currency: 'USD'
                },
                event_source_url: eventData.pageUrl
            }]
        };

        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`,
            pixelEvent,
            {
                params: {
                    access_token: FACEBOOK_ACCESS_TOKEN
                }
            }
        );

        console.log('✅ Event sent to Facebook Pixel:', response.data);
        return { success: true, pixelResponse: response.data };
    } catch (error) {
        console.error('❌ Facebook Pixel Error:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send notification to Telegram
 */
async function sendTelegramNotification(eventData) {
    try {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('⚠️ Telegram credentials not configured');
            return { success: false, message: 'Telegram not configured' };
        }

        const message = `
🎯 **NEW LEAD TRACKED**

📌 Event Type: ${eventData.eventType}
🔘 Button Section: ${eventData.buttonSection}
⏰ Time: ${new Date(eventData.timestamp).toLocaleString()}
🌐 Page: ${eventData.pageUrl}
📱 Device: ${eventData.userAgent?.substring(0, 50)}...

From: Server-Side Tracking
        `;

        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }
        );

        console.log('✅ Notification sent to Telegram');
        return { success: true, telegramResponse: response.data };
    } catch (error) {
        console.error('❌ Telegram Error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Main Tracking Endpoint
 * POST /api/track
 */
app.post('/api/track', async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            userIp: req.ip || req.connection.remoteAddress,
            receivedAt: new Date().toISOString()
        };

        // Store event locally
        events.push(eventData);
        console.log(`📊 Event stored (Total: ${events.length})`);

        // Send to Facebook Pixel
        const pixelResult = await sendToFacebookPixel(eventData);

        // Send Telegram notification
        const telegramResult = await sendTelegramNotification(eventData);

        // Response
        res.json({
            success: true,
            message: 'Event tracked successfully',
            eventId: events.length,
            pixelStatus: pixelResult.success ? 'sent' : 'failed',
            telegramStatus: telegramResult.success ? 'sent' : 'not_configured'
        });

    } catch (error) {
        console.error('❌ Tracking Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Analytics Endpoint
 * GET /api/analytics
 */
app.get('/api/analytics', (req, res) => {
    try {
        const analytics = {
            totalEvents: events.length,
            eventsByType: {},
            eventsBySection: {},
            recentEvents: events.slice(-10).reverse()
        };

        events.forEach(event => {
            // Count by type
            analytics.eventsByType[event.eventType] = 
                (analytics.eventsByType[event.eventType] || 0) + 1;
            
            // Count by section
            analytics.eventsBySection[event.buttonSection] = 
                (analytics.eventsBySection[event.buttonSection] || 0) + 1;
        });

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * Welcome Page
 */
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Munaf Trading API</title>
            <style>
                body {
                    font-family: Arial;
                    background: #0a0f1a;
                    color: #00D4FF;
                    padding: 20px;
                    text-align: center;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(0,212,255,0.05);
                    padding: 30px;
                    border-radius: 10px;
                    border: 1px solid #00D4FF;
                }
                code {
                    background: #0f1626;
                    padding: 10px;
                    border-radius: 5px;
                    display: block;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚡ MUNAF Trading API</h1>
                <p>Server-side tracking is active!</p>
                
                <h3>Available Endpoints:</h3>
                <code>POST /api/track - Send tracking events</code>
                <code>GET /api/analytics - View analytics</code>
                <code>GET /health - Server status</code>
                
                <p style="margin-top: 30px; color: #8a9abb;">
                    Powered by @adbagency
                </p>
            </div>
        </body>
        </html>
    `);
});

// Error Handling
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        error: err.message
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════╗
    ║  ⚡ MUNAF Trading Backend Server   ║
    ║  Running on port ${PORT}             ║
    ║  Pixel ID: ${FACEBOOK_PIXEL_ID}     ║
    ╚════════════════════════════════════╝
    `);
    console.log('✅ Server is ready to track events');
    console.log('📊 Analytics available at /api/analytics');
    console.log('❌ Make sure Facebook Access Token is configured in .env');
});

module.exports = app;
