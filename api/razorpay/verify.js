import crypto from 'crypto';
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

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_id
    } = req.body || {};

    // 1. Signature Verification
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isValid = generatedSignature === razorpay_signature;

      return res.status(200).json({
        verified: isValid,
        status: isValid ? 'success' : 'failed',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        message: isValid ? 'Signature verified successfully' : 'Invalid payment signature'
      });
    }

    // 2. Fetch Payment Status Verification from Razorpay API
    const targetPaymentId = razorpay_payment_id || payment_id;
    if (targetPaymentId) {
      const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      
      const paymentDetails = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.razorpay.com',
          port: 443,
          path: `/v1/payments/${targetPaymentId}`,
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Origin': 'https://maverickwebdav.vercel.app',
            'Referer': 'https://maverickwebdav.vercel.app/'
          },
          timeout: 15000
        };

        const request = https.request(options, (response) => {
          let data = '';
          response.on('data', chunk => { data += chunk; });
          response.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ raw: data });
            }
          });
        });

        request.on('error', reject);
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('Razorpay verification timeout'));
        });

        request.end();
      });

      const isCaptured = paymentDetails.status === 'captured' || paymentDetails.status === 'authorized';
      return res.status(200).json({
        verified: isCaptured,
        status: paymentDetails.status,
        payment: paymentDetails
      });
    }

    return res.status(400).json({ error: 'Missing payment details for verification' });

  } catch (error) {
    console.error('Razorpay Verify Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Verification server error' });
  }
}
