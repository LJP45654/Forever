const { query } = require('../utils/db');

async function getOthersTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(o.purchase_date, '%Y-%m-%d') AS date, o.purchase_amount AS amount, o.currency
    FROM others o
    ORDER BY o.purchase_date ASC;
  `;
  return await query(sql);
}

async function getAllOtherRecords(req, res) {
  try {
    const sql = `
     SELECT * FROM others
     `;
    const result = await query(sql);
    res.json(result);

  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }

}

module.exports = { getOthersTimeSeries,getAllOtherRecords };