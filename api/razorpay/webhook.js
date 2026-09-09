import crypto from 'crypto';
import https from 'https';
import http from 'http';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'g0EVlGEErOuiu0maLFAq8s96';

// AcceptPay VPS & Backend Callback Endpoints
const BACKEND_URLS = [
  'https://acceptpay.publicvm.com/api/v1/payment/webhook/razorpay-internal',
  'http://222.167.207.247:5000/api/v1/payment/webhook/razorpay-internal'
];

export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    if (signature && RAZORPAY_WEBHOOK_SECRET) {
      try {
        const expectedSignature = crypto
          .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
          .update(rawBody)
          .digest('hex');

        if (signature !== expectedSignature) {
          console.warn('[Razorpay Webhook] Signature mismatch. Proceeding with forward.');
        } else {
          console.log('[Razorpay Webhook] Signature verified successfully.');
        }
      } catch (e) {
        console.error('[Razorpay Webhook] Signature check error:', e);
      }
    }

    const payload = req.body;
    console.log(`[Razorpay Webhook] Received Event: ${payload.event || 'unknown'}`);

    // Forward webhook to AcceptPay VPS Backend synchronously (awaited for Serverless)
    const forwardPromises = BACKEND_URLS.map(backendUrl => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(backendUrl);
          const isHttps = urlObj.protocol === 'https:';
          const client = isHttps ? https : http;

          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(rawBody),
              'X-Razorpay-Signature': signature || '',
              'X-Forwarded-From': 'maverickwebdav.vercel.app',
              'X-Proxy-Secret': 'acceptpay-proxy-secret-2024'
            },
            timeout: 5000
          };

          const forwardReq = client.request(options, (forwardRes) => {
            console.log(`[Razorpay Webhook] Forwarded to ${backendUrl} -> Status: ${forwardRes.statusCode}`);
            forwardRes.resume();
            forwardRes.on('end', () => resolve({ url: backendUrl, status: forwardRes.statusCode }));
          });

          forwardReq.on('error', (err) => {
            console.warn(`[Razorpay Webhook] Failed forwarding to ${backendUrl}:`, err.message);
            resolve({ url: backendUrl, error: err.message });
          });

          forwardReq.on('timeout', () => {
            forwardReq.destroy();
            resolve({ url: backendUrl, error: 'timeout' });
          });

          forwardReq.write(rawBody);
          forwardReq.end();
        } catch (fwdErr) {
          console.error(`[Razorpay Webhook] Error preparing forward to ${backendUrl}:`, fwdErr.message);
          resolve({ url: backendUrl, error: fwdErr.message });
        }
      });
    });

    // CRITICAL for Vercel Serverless: Await all forwards before closing response
    const results = await Promise.allSettled(forwardPromises);
    console.log('[Razorpay Webhook] Forward results:', JSON.stringify(results));

    return res.status(200).json({ status: 'received', forwarded: true });

  } catch (error) {
    console.error('[Razorpay Webhook] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
