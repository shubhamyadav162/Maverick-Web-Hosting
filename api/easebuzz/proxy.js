export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { target, payload, env } = req.body || {};

    if (!target || !payload) {
      return res.status(400).json({ error: 'Target and payload are required' });
    }

    const baseUrl = env === 'test' 
      ? 'https://testpay.easebuzz.in' 
      : 'https://pay.easebuzz.in';

    const url = `${baseUrl}${target}`;
    
    // Convert payload to form url encoded format (Easebuzz API requirement)
    const postData = new URLSearchParams(payload).toString();

    console.log(`Proxying request to Easebuzz: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData).toString()
      },
      body: postData
    });

    const responseBodyText = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(responseBodyText);
    } catch (e) {
      responseBody = responseBodyText;
    }

    return res.status(response.status).json({
      status: response.status,
      body: responseBody
    });

  } catch (error) {
    console.error('Easebuzz proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
