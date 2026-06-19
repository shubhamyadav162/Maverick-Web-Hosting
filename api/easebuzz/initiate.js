/**
 * Easebuzz Payment Initiation Proxy
 * 
 * Receives payment initiation request from AcceptPay VPS,
 * forwards to Easebuzz API with whitelisted domain Origin header.
 * 
 * POST /api/easebuzz/initiate
 * Body: { txnid, amount, productinfo, firstname, email, phone, udf1-udf5, hash }
 * Returns: Easebuzz SUVA response with qr_link (raw UPI string)
 */

const https = require('https');

const EASEBUZZ_API_URL = 'https://pay.easebuzz.in/payment/initiateLink';
const VPS_BACKEND = process.env.VPS_BACKEND_URL || 'http://87.232.72.67';
const PROXY_SECRET = process.env.EASEBUZZ_PROXY_SECRET || 'acceptpay_easebuzz_proxy_2026';

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify request came from our VPS
    const proxySecret = req.headers['x-proxy-secret'];
    if (proxySecret !== PROXY_SECRET) {
      console.error('[EasebuzzProxy] Unauthorized request - invalid proxy secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { txnid, amount, productinfo, firstname, email, phone, udf1, udf2, udf3, udf4, udf5, hash } = req.body;

    if (!txnid || !amount || !hash) {
      return res.status(400).json({ error: 'Missing required fields: txnid, amount, hash' });
    }

    console.log(`[EasebuzzProxy] Initiating payment: txnid=${txnid}, amount=${amount}`);

    // Build form body for Easebuzz
    const postData = {
      key: process.env.EASEBUZZ_API_KEY,
      txnid,
      amount: amount.toString(),
      productinfo: productinfo || 'Payment',
      firstname: firstname || 'Customer',
      email: email || 'customer@acceptpay.in',
      phone: phone || '9999999999',
      surl: 'https://maverickwebdav.vercel.app/api/easebuzz/callback',
      furl: 'https://maverickwebdav.vercel.app/api/easebuzz/callback',
      hash,
      payment_mode: 'UPI',
      upi_qr: 'true',
      request_mode: 'SUVA',
      udf1: udf1 || '',
      udf2: udf2 || '',
      udf3: udf3 || '',
      udf4: udf4 || '',
      udf5: udf5 || ''
    };

    const body = Object.entries(postData)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    // Forward to Easebuzz with whitelisted domain headers
    const easebuzzResponse = await new Promise((resolve, reject) => {
      const url = new URL(EASEBUZZ_API_URL);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
          'Origin': 'https://maverickwebdav.vercel.app',
          'Referer': 'https://maverickwebdav.vercel.app/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 MaverickPay/1.0'
        },
        timeout: 15000
      };

      const req = https.request(options, (response) => {
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

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(body);
      req.end();
    });

    console.log(`[EasebuzzProxy] Response: status=${easebuzzResponse.status}, hasQrLink=${!!easebuzzResponse.qr_link}`);

    return res.status(200).json(easebuzzResponse);

  } catch (error) {
    console.error('[EasebuzzProxy] Error:', error.message);
    return res.status(500).json({ error: error.message || 'Proxy error' });
  }
};
