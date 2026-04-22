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
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const config = getRedisConfig();
  if (!config) {
    return res.status(500).json({ error: 'Redis env vars not configured' });
  }

  try {
    const response = await fetch(`${config.url}/get/gabriela_responses`, {
      headers: { Authorization: `Bearer ${config.token}` }
    });
    const json = await response.json();
    const data = json.result ? JSON.parse(json.result) : {};
    res.status(200).json(data || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
