const { query } = require('../utils/db.js');
async function getDepositTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(d.start_date, '%Y-%m-%d') AS date, d.principal AS amount, d.currency
    FROM deposit d
    ORDER BY d.start_date ASC;
  `;
  return await query(sql);
}

module.exports = { getDepositTimeSeries };