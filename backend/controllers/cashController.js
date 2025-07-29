const { query } = require('../utils/db.js');

// 获取所有现金记录
async function getAllCashRecords(req, res) {
  try {
    const cashRecords = await query('SELECT * FROM cash');
    res.json(cashRecords);
  } catch (error) {
    console.error('Error fetching cash records:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getCashCurrency(req, res) {
  try {
    const currency = await query('SELECT DISTINCT currency FROM cash');
    res.json(currency);
  } catch (error) {
    console.error('Error fetching cash currency:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

module.exports = {
  getAllCashRecords,
  getCashCurrency,
}