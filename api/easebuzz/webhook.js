/**
 * Easebuzz Webhook Proxy
 * PURE RELAY — forwards Easebuzz webhook to VPS. No credentials stored here.
 */

import http from 'http';

const VPS_WEBHOOK_URL = process.env.VPS_WEBHOOK_URL || 'http://87.232.72.67/api/v1/payment/webhook/easebuzz';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rawBody = typeof req.body === 'string'
      ? req.body
      : new URLSearchParams(req.body).toString();

    const params = new URLSearchParams(rawBody);
    console.log(`[EasebuzzWebhookProxy] Relaying: txnid=${params.get('txnid')}, status=${params.get('status')}`);

    const vpsResponse = await new Promise((resolve, reject) => {
      const url = new URL(VPS_WEBHOOK_URL);
      const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(rawBody),
          'X-Forwarded-For': 'maverickwebdav.vercel.app',
          'X-Webhook-Source': 'easebuzz-proxy'
        },
        timeout: 10000
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

    console.log(`[EasebuzzWebhookProxy] VPS responded: ${vpsResponse.statusCode}`);
    return res.status(200).json({ status: 'success' });

  } catch (error) {
    console.error('[EasebuzzWebhookProxy] Error:', error.message);
    return res.status(200).json({ status: 'acknowledged' });
  }
}
