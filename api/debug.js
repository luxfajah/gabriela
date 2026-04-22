export default async function handler(req, res) {
  const redisUrl = process.env.REDIS_URL || '';
  let parsed = null;
  let error = null;

  try {
    const u = new URL(redisUrl);
    parsed = {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port,
      username: u.username,
      hasPassword: !!u.password,
      passwordLength: u.password?.length,
      restUrl: `https://${u.hostname}`,
    };
  } catch (e) {
    error = e.message;
  }

  res.status(200).json({
    hasRedisUrl: !!redisUrl,
    redisUrlStart: redisUrl.substring(0, 20) + '...',
    parsed,
    error,
    envKeys: Object.keys(process.env).filter(k =>
      k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH')
    )
  });
}
