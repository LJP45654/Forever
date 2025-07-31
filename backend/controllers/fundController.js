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
    const formattedResult = result.map(record => ({
      ...record,
      purchase_date: record.purchase_date ? record.purchase_date.toISOString().split('T')[0] : null,
    }));

    res.json(formattedResult);

  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }

}

module.exports = { getFundTimeSeries,getAllFundRecord };