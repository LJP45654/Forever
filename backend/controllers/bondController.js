const { query } = require('../utils/db.js');

async function getBondTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(b.start_date, '%Y-%m-%d') AS date, b.amount AS amount, b.currency
    FROM bonds b
    ORDER BY b.start_date ASC;
  `;
  return await query(sql);
}

module.exports ={
  getBondTimeSeries,
}