import https from 'https';
import crypto from 'crypto';

const EASYMARVEL_KEY = 'U6MU08B6XB';
const EASYMARVEL_SALT = '6TAOVKCEY7';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, firstname, email, phone, productinfo, address, city, state, pincode } = req.body;

    if (!amount || !firstname || !email || !phone) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const txnid = 'MAV_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    
    // Sanitize product info (alphanumeric + spaces only)
    const sanitizedProductInfo = (productinfo || 'Software Project')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim() || 'Software Project';

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = [
      EASYMARVEL_KEY,
      txnid,
      amount.toString(),
      sanitizedProductInfo,
      firstname,
      email,
      'maverick', // udf1
      '', '', '', '', '', '', '', '', '',
      EASYMARVEL_SALT
    ].join('|');

    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const payload = {
      key: EASYMARVEL_KEY,
      txnid,
      amount: amount.toString(),
      productinfo: sanitizedProductInfo,
      firstname,
      email,
      phone,
      surl: 'https://maverickwebdav.vercel.app/api/easebuzz/callback',
      furl: 'https://maverickwebdav.vercel.app/api/easebuzz/callback',
      hash,
      udf1: 'maverick',
      request_flow: 'SEAMLESS',
      address1: address || '',
      city: city || '',
      state: state || '',
      zipcode: pincode || '',
      country: 'India'
    };

    const postData = new URLSearchParams(payload).toString();

    console.log(`[PayCheckout] Initiating payment for ${firstname} of amount ₹${amount}`);

    const easebuzzRes = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'pay.easebuzz.in',
        port: 443,
        path: '/payment/initiateLink',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'Origin': 'https://maverickwebdav.vercel.app',
          'Referer': 'https://maverickwebdav.vercel.app/',
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
            reject(new Error(`Failed to parse Easebuzz response: ${data}`));
          }
        });
      });

      proxyReq.on('error', reject);
      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        reject(new Error('Easebuzz API request timeout'));
      });

      proxyReq.write(postData);
      proxyReq.end();
    });

    if (easebuzzRes.status === 1 && easebuzzRes.data) {
      console.log(`[PayCheckout] Success. Obtained access key: ${easebuzzRes.data}`);
      return res.status(200).json({
        status: 'success',
        access_key: easebuzzRes.data,
        key: EASYMARVEL_KEY
      });
    } else {
      console.error(`[PayCheckout] Failed: ${JSON.stringify(easebuzzRes)}`);
      const errMsg = easebuzzRes.error_desc || easebuzzRes.data || 'Payment gateway unavailable. Please try again.';
      return res.status(400).json({
        status: 'fail',
        message: typeof errMsg === 'string' && errMsg.includes('blocked')
          ? 'Payment gateway is temporarily unavailable. Please contact support.'
          : errMsg
      });
    }

  } catch (error) {
    console.error('[PayCheckout] Exception:', error.message);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
