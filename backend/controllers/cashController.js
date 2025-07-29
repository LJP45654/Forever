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
    sql = `SELECT c.currency,SUM(c.amount) as total_amount,SUM(c.amount * er.rate_to_cny) as total_amount_cny
        FROM cash c
        JOIN exchange_rates er ON c.currency = er.currency_code
        GROUP BY c.currency
        ORDER BY c.currency;`
    const currency = await query(sql);
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