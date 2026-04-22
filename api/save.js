import { createClient } from 'redis';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    await client.set('gabriela_responses', JSON.stringify(req.body));
    await client.disconnect();
    res.status(200).json({ status: 'success' });
  } catch (e) {
    try { await client.disconnect(); } catch {}
    res.status(500).json({ error: e.message });
  }
}
