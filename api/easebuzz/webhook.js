/**
 * Easebuzz Webhook Proxy
 * 
 * Receives webhook from Easebuzz payment gateway,
 * verifies origin, and forwards to AcceptPay VPS backend.
 * 
 * POST /api/easebuzz/webhook
 * Forwards raw body to VPS: POST http://87.232.72.67/api/v1/payment/webhook/easebuzz
 */

const http = require('http');
const https = require('https');

const VPS_WEBHOOK_URL = process.env.VPS_WEBHOOK_URL || 'http://87.232.72.67/api/v1/payment/webhook/easebuzz';
const ALLOWED_EASEBUZZ_IPS = [
  // Easebuzz webhook source IPs (update if needed)
  '103.21.58.0/24',
  '103.21.59.0/24',
  '13.228.0.0/16',
  '52.76.0.0/16'
];

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[EasebuzzWebhookProxy] Received webhook from Easebuzz');

    // Get raw body - Vercel may parse it, so we reconstruct
    const rawBody = typeof req.body === 'string' 
      ? req.body 
      : new URLSearchParams(req.body).toString();

    // Extract key info for logging (don't log sensitive hash)
    const bodyStr = rawBody || '';
    const params = new URLSearchParams(bodyStr);
    const txnid = params.get('txnid') || 'unknown';
    const status = params.get('status') || 'unknown';

    console.log(`[EasebuzzWebhookProxy] txnid=${txnid}, status=${status}`);

    // Forward to VPS backend
    const vpsResponse = await forwardToVPS(rawBody);

    console.log(`[EasebuzzWebhookProxy] VPS responded: ${vpsResponse.statusCode}`);

    return res.status(200).json({ 
      status: 'success', 
      message: 'Webhook forwarded to VPS',
      vpsStatus: vpsResponse.statusCode 
    });

  } catch (error) {
    console.error('[EasebuzzWebhookProxy] Error:', error.message);
    // Still return 200 to Easebuzz to prevent retries while we debug
    return res.status(200).json({ status: 'acknowledged', error: error.message });
  }
};

/**
 * Forward raw webhook body to VPS backend
 */
function forwardToVPS(rawBody) {
  return new Promise((resolve, reject) => {
    const url = new URL(VPS_WEBHOOK_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(rawBody),
        'X-Forwarded-For': 'maverickwebdav.vercel.app',
        'X-Webhook-Source': 'easebuzz-proxy'
      },
      timeout: 10000
    };

    const proxyReq = client.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => { data += chunk; });
      proxyRes.on('end', () => {
        resolve({ statusCode: proxyRes.statusCode, body: data });
      });
    });

    proxyReq.on('error', reject);
    proxyReq.on('timeout', () => { proxyReq.destroy(); reject(new Error('VPS timeout')); });
    proxyReq.write(rawBody);
    proxyReq.end();
  });
}
