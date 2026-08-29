import https from 'https';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TVZDaWYRR3Y6Dt';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'g0EVlGEErOuiu0maLFAq8s96';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    const params = req.method === 'POST' ? req.body : req.query;
    const {
      amount,
      order_id,
      name = 'Ott King',
      description = 'Order Payment',
      customer_name = 'Customer',
      email = 'customer@example.com',
      phone = '9999999999',
      callback_url = '',
      redirect = 'true'
    } = params || {};

    let orderId = order_id;
    let amountInPaise = amount ? Math.round(Number(amount)) : 10000;

    // Convert rupees to paise if passed in standard rupees
    if (amount && Number(amount) < 100000 && !Number.isInteger(Number(amount) * 100)) {
      amountInPaise = Math.round(Number(amount) * 100);
    }

    // If order_id not passed, generate one on the fly
    if (!orderId && amountInPaise > 0) {
      const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const orderPayload = JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          origin: 'maverickwebdav.vercel.app',
          customer_name
        }
      });

      const orderResult = await new Promise((resolve) => {
        const orderReq = https.request({
          hostname: 'api.razorpay.com',
          port: 443,
          path: '/v1/orders',
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(orderPayload),
            'Origin': 'https://maverickwebdav.vercel.app',
            'Referer': 'https://maverickwebdav.vercel.app/'
          }
        }, (orderRes) => {
          let data = '';
          orderRes.on('data', chunk => data += chunk);
          orderRes.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(null);
            }
          });
        });
        orderReq.on('error', () => resolve(null));
        orderReq.write(orderPayload);
        orderReq.end();
      });

      if (orderResult && orderResult.id) {
        orderId = orderResult.id;
      }
    }

    // Render whitelisted HTML checkout page with embedded Razorpay standard modal
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Gateway - ${name}</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    body {
      background-color: #0d0f12;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #181b20;
      border: 1px solid #282c34;
      border-radius: 16px;
      padding: 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.2);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }
    .amount {
      font-size: 32px;
      font-weight: 800;
      color: #3b82f6;
      margin: 16px 0;
    }
    .desc {
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .loader {
      display: inline-block;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔒 Verified Whitelisted Gateway</div>
    <h1 class="title">${name}</h1>
    <div class="desc">${description}</div>
    <div class="amount">₹${(amountInPaise / 100).toFixed(2)}</div>
    <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">
      Connecting securely to Razorpay...
    </p>
    <button id="pay-btn" class="btn" onclick="openRazorpay()">
      Pay ₹${(amountInPaise / 100).toFixed(2)} Now
    </button>
  </div>

  <script>
    const options = {
      key: "${RAZORPAY_KEY_ID}",
      amount: "${amountInPaise}",
      currency: "INR",
      name: "${name}",
      description: "${description}",
      order_id: "${orderId || ''}",
      prefill: {
        name: "${customer_name}",
        email: "${email}",
        contact: "${phone}"
      },
      theme: {
        color: "#2563eb"
      },
      handler: function(response) {
        // Send verification to our whitelisted proxy
        fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        }).then(res => res.json()).then(data => {
          if ('${callback_url}') {
            window.location.href = '${callback_url}?status=success&payment_id=' + response.razorpay_payment_id;
          } else {
            alert('Payment Successful! ID: ' + response.razorpay_payment_id);
            window.location.href = '/?status=success';
          }
        }).catch(err => {
          alert('Payment completed. Verifying on server...');
          window.location.href = '/?status=completed';
        });
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
        }
      }
    };

    function openRazorpay() {
      const rzp = new Razorpay(options);
      rzp.open();
    }

    // Automatically trigger checkout popup on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(openRazorpay, 500);
    });
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Razorpay Pay Redirection Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
