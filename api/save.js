export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Suporta tanto Vercel KV (KV_REST_API_*) quanto Upstash direto (UPSTASH_REDIS_REST_*)
    const url   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Redis env vars not configured' });
    }

    const data = req.body;
    const serialized = JSON.stringify(data);

    // Upstash REST API: SET key value
    const response = await fetch(`${url}/set/gabriela_responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serialized)
    });

    const json = await response.json();
    if (json.result === 'OK') {
      res.status(200).json({ status: 'success' });
    } else {
      res.status(500).json({ error: json });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
