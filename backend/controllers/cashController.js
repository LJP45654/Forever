import { query } from '../utils/db.js';

// 获取所有现金记录
export async function getAllCashRecords(req, res) {
  try {
    const cashRecords = await query('SELECT * FROM cash');
    res.json(cashRecords);
  } catch (error) {
    console.error('Error fetching cash records:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

export async function getCashCurrency(req, res) {
  try {
    const currency = await query('SELECT DISTINCT currency FROM cash');
    res.json(currency);
  } catch (error) {
    console.error('Error fetching cash currency:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}