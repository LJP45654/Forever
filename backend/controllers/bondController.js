const { query } = require('../utils/db.js');

async function getBondTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(b.start_date, '%Y-%m-%d') AS date, b.amount AS amount, b.currency
    FROM bonds b
    ORDER BY b.start_date ASC;
  `;
  return await query(sql);
}

async function getAllBondRecords(req, res) {
  try {
    const sql = `
    SELECT b.bond_name,b.rate,DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date, 
    DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,
    b.amount AS amount, b.currency,b.interest
    FROM bonds b
    ORDER BY b.start_date ASC;
  `;
  const bondRecords = await query(sql);
    res.json(bondRecords);
  } catch (error) {
    console.error('Error fetching cash records:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

module.exports ={
  getBondTimeSeries,
  getAllBondRecords,
}