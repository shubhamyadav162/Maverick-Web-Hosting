/**
 * Easebuzz Payment Initiation Proxy
 * 
 * PURE RELAY — just forwards VPS request to Easebuzz with whitelisted Origin header.
 * No Easebuzz credentials stored here. VPS sends everything.
 * Same pattern as Razorpay Netlify proxy.
 * 
 * POST /api/easebuzz/initiate
 * Body: whatever VPS sends (form-urlencoded or JSON)
 * Adds: Origin + Referer headers from maverickwebdav.vercel.app
 */

const https = require('https');

const EASEBUZZ_API_URL = 'https://pay.easebuzz.in/payment/initiateLink';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('[EasebuzzProxy] Relaying payment initiation to Easebuzz');

    // VPS sends raw form body or JSON — forward as-is
    const rawBody = typeof req.body === 'string'
      ? req.body
      : (req.headers['content-type']?.includes('json')
        ? JSON.stringify(req.body)
        : Object.entries(req.body || {}).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'));

    // Forward to Easebuzz with whitelisted domain headers
    const easebuzzResponse = await new Promise((resolve, reject) => {
      const url = new URL(EASEBUZZ_API_URL);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(rawBody),
          'Origin': 'https://maverickwebdav.vercel.app',
          'Referer': 'https://maverickwebdav.vercel.app/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 MaverickPay/1.0'
        },
        timeout: 15000
      };

      const proxyReq = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Easebuzz response parse: ${data.substring(0, 200)}`)); }
        });
      });

      proxyReq.on('error', reject);
      proxyReq.on('timeout', () => { proxyReq.destroy(); reject(new Error('Timeout')); });
      proxyReq.write(rawBody);
      proxyReq.end();
    });

    console.log(`[EasebuzzProxy] Response: status=${easebuzzResponse.status}, hasQrLink=${!!easebuzzResponse.qr_link}`);
    return res.status(200).json(easebuzzResponse);

  } catch (error) {
    console.error('[EasebuzzProxy] Error:', error.message);
    return res.status(500).json({ error: error.message || 'Proxy error' });
  }
};
