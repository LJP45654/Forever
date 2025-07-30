const { query } = require('../utils/db');

async function getFundTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(f.purchase_date, '%Y-%m-%d') AS date, f.purchase_price * f.units AS amount, f.currency
    FROM funds f
    ORDER BY f.purchase_date ASC;
  `;
  return await query(sql);
}

module.exports = { getFundTimeSeries };