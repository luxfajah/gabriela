export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { kv } = await import('@vercel/kv');
    const data = await kv.get('gabriela_responses');
    res.status(200).json(data || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
