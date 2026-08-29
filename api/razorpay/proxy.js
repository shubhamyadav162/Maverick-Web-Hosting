import https from 'https';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TVZDaWYRR3Y6Dt';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g0EVlGEErOuiu0maLFAq8s96';
const PROXY_SECRET = process.env.PROXY_SECRET || 'acceptpay-proxy-secret-2024';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Proxy-Secret',
  'Content-Type': 'application/json'
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  const proxySecret = req.headers['x-proxy-secret'];
  if (proxySecret && proxySecret !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized proxy access' });
  }

  try {
    const { endpoint = '/orders', method = 'POST', data = {} } = req.body || {};

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const postData = (method === 'GET' || method === 'HEAD') ? null : JSON.stringify(data);

    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Origin': 'https://maverickwebdav.vercel.app',
      'Referer': 'https://maverickwebdav.vercel.app/'
    };

    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const razorpayResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.razorpay.com',
        port: 443,
        path: `/v1${cleanEndpoint}`,
        method: method.toUpperCase(),
        headers,
        timeout: 20000
      };

      const request = https.request(options, (response) => {
        let resData = '';
        response.on('data', chunk => { resData += chunk; });
        response.on('end', () => {
          try {
            resolve({ statusCode: response.statusCode, data: JSON.parse(resData) });
          } catch (e) {
            resolve({ statusCode: response.statusCode, data: { raw: resData } });
          }
        });
      });

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Proxy request timed out'));
      });

      if (postData) {
        request.write(postData);
      }
      request.end();
    });

    return res.status(razorpayResponse.statusCode || 200).json(razorpayResponse.data);

  } catch (error) {
    console.error('[Razorpay General Proxy] Error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
