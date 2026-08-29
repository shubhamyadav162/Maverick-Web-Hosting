import https from 'https';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TVZDaWYRR3Y6Dt';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g0EVlGEErOuiu0maLFAq8s96';
const PROXY_SECRET = process.env.PROXY_SECRET || 'acceptpay-proxy-secret-2024';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Proxy-Secret',
  'Content-Type': 'application/json'
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional Proxy Secret Check (allowing VPS or verified client calls)
  const proxySecret = req.headers['x-proxy-secret'];
  if (proxySecret && proxySecret !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized proxy request' });
  }

  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Razorpay requires amount in paise (1 INR = 100 paise)
    const amountInPaise = typeof amount === 'number' && amount < 1000000 && !Number.isInteger(amount * 100)
      ? Math.round(amount * 100)
      : Math.round(Number(amount));

    const postData = JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        ...notes,
        origin_domain: 'maverickwebdav.vercel.app',
        source: 'whitelisted_proxy'
      }
    });

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const razorpayResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.razorpay.com',
        port: 443,
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Origin': 'https://maverickwebdav.vercel.app',
          'Referer': 'https://maverickwebdav.vercel.app/'
        },
        timeout: 20000
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          try {
            resolve({ statusCode: response.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: response.statusCode, data: { raw: data } });
          }
        });
      });

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Razorpay API request timeout'));
      });

      request.write(postData);
      request.end();
    });

    return res.status(razorpayResponse.statusCode || 200).json({
      ...razorpayResponse.data,
      key_id: RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Razorpay Orders Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
