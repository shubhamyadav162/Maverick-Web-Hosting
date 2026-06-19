/**
 * Easebuzz Payment Callback Handler
 * 
 * Handles success/failure redirect from Easebuzz hosted checkout.
 * This is the surl/furl endpoint that Easebuzz redirects to after payment.
 * 
 * POST/GET /api/easebuzz/callback
 * Redirects user to AcceptPay success/fail page
 */

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Easebuzz sends form-urlencoded data on callback
    const data = req.method === 'POST' ? req.body : req.query;
    
    const txnid = data?.txnid || '';
    const status = data?.status || '';
    const amount = data?.amount || '';
    const error_message = data?.error_message || '';

    console.log(`[EasebuzzCallback] txnid=${txnid}, status=${status}, amount=${amount}`);

    // Determine redirect URL based on status
    // Extract AcceptPay transaction ID from udf1 (we stored it there)
    const acceptPayTxnId = data?.udf1 || '';

    if (status === 'success') {
      // Redirect to success page
      const successUrl = acceptPayTxnId 
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=success`
        : 'https://acceptpayfrontend.vercel.app/?status=success';
      return res.redirect(302, successUrl);
    } else {
      // Redirect to fail page
      const failUrl = acceptPayTxnId 
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=failed&error=${encodeURIComponent(error_message)}`
        : 'https://acceptpayfrontend.vercel.app/?status=failed';
      return res.redirect(302, failUrl);
    }

  } catch (error) {
    console.error('[EasebuzzCallback] Error:', error.message);
    return res.redirect(302, 'https://acceptpayfrontend.vercel.app/?status=error');
  }
};
