const { query } = require('../utils/db.js');

async function getTickerNames(req, res) {
  try {
    sql = `SELECT s.currency,SUM(s.current_price*s.quantity) as total_amount,SUM(s.current_price * er.rate_to_cny*s.quantity) as total_amount_cny
        FROM stocks s
        JOIN exchange_rates er ON s.currency = er.currency_code
        GROUP BY s.currency
        ORDER BY s.currency;`
    const tickerNames = await query(sql);
    res.json(tickerNames);
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getTickerRecords(req, res) {
  try {
    sql = `SELECT * FROM stocks;`
    const tickerRecords = await query(sql);
    res.json(tickerRecords);
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function updateHistoryRecords(req, res) {
  
}




module.exports = { getTickerNames,getTickerRecords };