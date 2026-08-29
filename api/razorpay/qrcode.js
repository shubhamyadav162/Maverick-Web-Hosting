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

  const proxySecret = req.headers['x-proxy-secret'];
  if (proxySecret && proxySecret !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized proxy request' });
  }

  try {
    const { 
      type = 'upi_qr', 
      name = 'Ott King', 
      usage = 'single_use', 
      fixed_amount = true, 
      payment_amount, 
      description = 'Order Payment',
      notes = {} 
    } = req.body || {};

    if (!payment_amount) {
      return res.status(400).json({ error: 'payment_amount is required' });
    }

    const amountInPaise = typeof payment_amount === 'number' && payment_amount < 1000000 && !Number.isInteger(payment_amount * 100)
      ? Math.round(payment_amount * 100)
      : Math.round(Number(payment_amount));

    const postData = JSON.stringify({
      type,
      name,
      usage,
      fixed_amount,
      payment_amount: amountInPaise,
      description,
      notes: {
        ...notes,
        origin: 'maverickwebdav.vercel.app',
        source: 'whitelisted_proxy'
      }
    });

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const qrResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.razorpay.com',
        port: 443,
        path: '/v1/payments/qr_codes',
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
        reject(new Error('Razorpay QR Code request timeout'));
      });

      request.write(postData);
      request.end();
    });

    const qrData = qrResponse.data || {};
    
    // Extract UPI Intent & QR string directly for seamless client usage
    const qrString = qrData.image_url || qrData.qr_code_url || '';
    const upiIntent = qrData.upi_intent || (qrData.notes && qrData.notes.upi_intent) || '';

    return res.status(qrResponse.statusCode || 200).json({
      status: 'success',
      ...qrData,
      qr_string: qrString,
      upi_intent: upiIntent,
      key_id: RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Razorpay QR Code Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
