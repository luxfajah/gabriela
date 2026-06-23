import { createClient } from 'redis';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    const raw = await client.get('gabriela_responses');
    await client.disconnect();
    if (raw) {
      const parsed = JSON.parse(raw);
      res.status(200).json(parsed.data || parsed);
    } else {
      res.status(200).json({});
    }
  } catch (e) {
    try { await client.disconnect(); } catch {}
    res.status(500).json({ error: e.message });
  }
}
