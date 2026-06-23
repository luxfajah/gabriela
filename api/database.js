import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { month } = req.query;
    const cleanMonth = (month === 'abril' || month === 'maio') ? month : 'maio';
    const dbName = `database_${cleanMonth}.json`;
    const dbPath = path.join(process.cwd(), dbName);
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    res.status(200).json(JSON.parse(dbContent));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
