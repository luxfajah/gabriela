import { createClient } from 'redis';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { month } = req.query;
  const cleanMonth = (month === 'abril' || month === 'maio') ? month : 'maio';
  const redisKey = `gabriela_responses_${cleanMonth}`;

  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    const raw = await client.get(redisKey);
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
