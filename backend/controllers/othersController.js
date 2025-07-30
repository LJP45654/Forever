const { query } = require('../utils/db');

async function getOthersTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(o.purchase_date, '%Y-%m-%d') AS date, o.purchase_amount AS amount, o.currency
    FROM others o
    ORDER BY o.purchase_date ASC;
  `;
  return await query(sql);
}

module.exports = { getOthersTimeSeries };