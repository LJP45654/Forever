const {query} = require('../utils/db.js');

async function getTickerNames(req, res) {
  try {
    const tickerNames = await query('SELECT DISTINCT ticker FROM stock');
    res.json(tickerNames);
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

module.exports = { getTickerNames };