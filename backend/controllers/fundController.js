const { query } = require('../utils/db');

async function getFundTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(f.purchase_date, '%Y-%m-%d') AS date, f.purchase_price * f.units AS amount, f.currency
    FROM funds f
    ORDER BY f.purchase_date ASC;
  `;
  return await query(sql);
}

async function getAllFundRecord(req, res) {
  try {
    const sql = `
     SELECT * FROM funds
     `;
    const result = await query(sql);
    res.json(result);

  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }

}

module.exports = { getFundTimeSeries,getAllFundRecord };