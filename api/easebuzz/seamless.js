/**
 * Easebuzz Seamless Payment Proxy
 * Relays Step 2 request (UPI/SUVA details) to Easebuzz.
 */

import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('[EasebuzzSeamlessProxy] Relaying seamless payment to Easebuzz');

    let rawBody;
    if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if (req.headers['content-type']?.includes('json')) {
      rawBody = JSON.stringify(req.body);
    } else {
      rawBody = Object.entries(req.body || {}).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    }

    // Determine target URL based on query parameter or body
    const env = req.query.env || req.body.env || 'production';
    const baseUrl = env === 'test' 
      ? 'https://testpay.easebuzz.in' 
      : 'https://pay.easebuzz.in';
    const EASEBUZZ_SEAMLESS_URL = `${baseUrl}/initiate_seamless_payment/`;

    const easebuzzResponse = await new Promise((resolve, reject) => {
      const url = new URL(EASEBUZZ_SEAMLESS_URL);
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
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Easebuzz response parse error: ${data.substring(0, 200)}`));
          }
        });
      });

      proxyReq.on('error', reject);
      proxyReq.on('timeout', () => { proxyReq.destroy(); reject(new Error('Timeout')); });
      proxyReq.write(rawBody);
      proxyReq.end();
    });

    console.log(`[EasebuzzSeamlessProxy] Response: status=${easebuzzResponse.status}, hasQrLink=${!!easebuzzResponse.qr_link}`);
    return res.status(200).json(easebuzzResponse);

  } catch (error) {
    console.error('[EasebuzzSeamlessProxy] Error:', error.message);
    return res.status(500).json({ error: error.message || 'Proxy error' });
  }
}
