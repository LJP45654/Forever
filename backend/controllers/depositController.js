const { query } = require('../utils/db.js');
async function getDepositTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(d.start_date, '%Y-%m-%d') AS date, d.principal AS amount, d.currency
    FROM deposit d
    ORDER BY d.start_date ASC;
  `;
  return await query(sql);
}

async function getAllDepositRecord(req, res) {
  try {
    const sql = `
     SELECT * FROM deposit
     `;
    const result = await query(sql);
    res.json(result);

  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }

}

module.exports = { 
  getDepositTimeSeries,
  getAllDepositRecord
 };