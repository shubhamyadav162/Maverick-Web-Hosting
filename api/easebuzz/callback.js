/**
 * Easebuzz Payment Callback Handler
 * Handles success/failure redirect from Easebuzz checkout.
 * ALSO forwards payment data to VPS so transaction status gets updated.
 */

import http from 'http';

const VPS_WEBHOOK_URL = 'http://87.232.72.67/api/v1/payment/webhook/easebuzz';

async function forwardToVPS(rawBody) {
  try {
    const url = new URL(VPS_WEBHOOK_URL);
    await new Promise((resolve, reject) => {
      const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(rawBody),
          'X-Forwarded-For': 'maverickwebdav.vercel.app',
          'X-Webhook-Source': 'easebuzz-callback'
        },
        timeout: 8000
      };
      const proxyReq = http.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', chunk => { data += chunk; });
        proxyRes.on('end', () => resolve({ statusCode: proxyRes.statusCode, body: data }));
      });
      proxyReq.on('error', reject);
      proxyReq.on('timeout', () => { proxyReq.destroy(); reject(new Error('VPS timeout')); });
      proxyReq.write(rawBody);
      proxyReq.end();
    });
  } catch (err) {
    console.error('[EasebuzzCallback] Forward to VPS failed:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const data = req.method === 'POST' ? req.body : req.query;
    const txnid = data?.txnid || '';
    const status = data?.status || '';
    const acceptPayTxnId = data?.udf3 || data?.udf1 || '';
    const error_message = data?.error_message || '';

    console.log(`[EasebuzzCallback] txnid=${txnid}, status=${status}, acceptPayTxnId=${acceptPayTxnId}`);

    const rawBody = typeof req.body === 'string'
      ? req.body
      : new URLSearchParams(req.body || {}).toString();

    // Forward to VPS to update transaction status (non-blocking)
    forwardToVPS(rawBody);

    if (status === 'success') {
      const successUrl = acceptPayTxnId && acceptPayTxnId !== 'maverick'
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=success`
        : 'https://maverickwebdav.vercel.app/services?status=success';
      return res.redirect(302, successUrl);
    } else {
      const failUrl = acceptPayTxnId && acceptPayTxnId !== 'maverick'
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=failed&error=${encodeURIComponent(error_message)}`
        : 'https://maverickwebdav.vercel.app/services?status=failed';
      return res.redirect(302, failUrl);
    }

  } catch (error) {
    console.error('[EasebuzzCallback] Error:', error.message);
    return res.redirect(302, 'https://acceptpayfrontend.vercel.app/?status=error');
  }
}
