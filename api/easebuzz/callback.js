/**
 * Easebuzz Payment Callback Handler
 * Handles success/failure redirect from Easebuzz checkout.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const data = req.method === 'POST' ? req.body : req.query;
    const txnid = data?.txnid || '';
    const status = data?.status || '';
    const acceptPayTxnId = data?.udf1 || '';
    const error_message = data?.error_message || '';

    console.log(`[EasebuzzCallback] txnid=${txnid}, status=${status}`);

    if (status === 'success') {
      const successUrl = acceptPayTxnId 
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=success`
        : 'https://acceptpayfrontend.vercel.app/?status=success';
      return res.redirect(302, successUrl);
    } else {
      const failUrl = acceptPayTxnId 
        ? `https://acceptpayfrontend.vercel.app/pay/${acceptPayTxnId}?status=failed&error=${encodeURIComponent(error_message)}`
        : 'https://acceptpayfrontend.vercel.app/?status=failed';
      return res.redirect(302, failUrl);
    }

  } catch (error) {
    console.error('[EasebuzzCallback] Error:', error.message);
    return res.redirect(302, 'https://acceptpayfrontend.vercel.app/?status=error');
  }
}
