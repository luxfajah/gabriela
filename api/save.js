function getRedisConfig() {
  // Tenta variáveis REST API explícitas primeiro
  const restUrl   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (restUrl && restToken) return { url: restUrl, token: restToken };

  // Tenta parsear REDIS_URL no formato Upstash: rediss://default:TOKEN@HOST.upstash.io:PORT
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const u = new URL(redisUrl);
      return {
        url:   `https://${u.hostname}`,
        token: u.password,
      };
    } catch (e) {}
  }

  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const config = getRedisConfig();
  if (!config) {
    return res.status(500).json({ error: 'Redis env vars not configured' });
  }

  try {
    const data = req.body;
    const serialized = JSON.stringify(data);

    const response = await fetch(`${config.url}/set/gabriela_responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
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
