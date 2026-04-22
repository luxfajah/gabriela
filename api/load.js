export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // Suporta tanto Vercel KV (KV_REST_API_*) quanto Upstash direto (UPSTASH_REDIS_REST_*)
    const url   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Redis env vars not configured' });
    }

    const response = await fetch(`${url}/get/gabriela_responses`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await response.json();
    // Upstash REST retorna { result: "\"valor\"" }
    const data = json.result ? JSON.parse(json.result) : {};
    res.status(200).json(data || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
