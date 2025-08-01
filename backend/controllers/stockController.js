const { query } = require('../utils/db.js');
const { updateTickersByCode, deleteTickersByCode } = require('./stockDataController.js');

async function getTickerNames(req, res) {
  try {
    sql = `SELECT s.currency,SUM(s.current_price*s.quantity) as total_amount,SUM(s.current_price * er.rate_to_cny*s.quantity) as total_amount_cny
        FROM stocks s
        JOIN exchange_rates er ON s.currency = er.currency_code
        GROUP BY s.currency
        ORDER BY s.currency;`
    const tickerNames = await query(sql);
    res.json(tickerNames);
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getTickerRecords(req, res) {
  try {
    if (req.body) {
      const { filter } = req.body;
      sql = `SELECT 
  id,
  stock_name,
  currency,
  quantity,
  ROUND(purchase_price, 2) AS purchase_price,
  ROUND(current_price, 2) AS current_price,
  ROUND(profit_loss, 2) AS profit_loss,
  DATE_FORMAT(purchase_date, '%Y-%m-%d') AS purchase_date
FROM stocks
  WHERE stock_name=?`
      const tickerRecords = await query(sql, [filter]);
      res.json(tickerRecords);
    }
    else {
      sql = `SELECT 
  id,
  stock_name,
  currency,
  quantity,
  ROUND(purchase_price, 2) AS purchase_price,
  ROUND(current_price, 2) AS current_price,
  ROUND(profit_loss, 2) AS profit_loss,
  DATE_FORMAT(purchase_date, '%Y-%m-%d') AS purchase_date
FROM stocks;`
      const tickerRecords = await query(sql);
      res.json(tickerRecords);
    }

  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getStockTimeSeries() {
  const sql = `
    SELECT sd.date AS date,
           ROUND(SUM(s.quantity * sd.close_price),2) AS amount,
           s.currency
    FROM stocks s
    JOIN stock_data sd ON sd.ticker = s.stock_code AND sd.date >= s.purchase_date
    GROUP BY sd.date, s.currency
    ORDER BY sd.date ASC;
  `;
  return await query(sql);
}

async function getAllStockTimeSeries(req, res) {
  try {
    res.json(await getStockTimeSeries());
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getStockTimeSeriesById(req, res) {
  try {
    const id = req.params.id;
    const sql = `
    SELECT 
      sd.date AS date,
      FORMAT(s.quantity * sd.close_price,2) AS amount,
      s.currency
    FROM stocks s
    JOIN stock_data sd 
      ON sd.ticker = s.stock_code AND sd.date >= s.purchase_date
    WHERE s.id = ?
    ORDER BY sd.date ASC;
  `;
    res.json(await query(sql, [id]));
  } catch (error) {
    console.error('Error fetching ticker names:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function insertStockRecords(req, res) {
  try {
    const records = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array.' });
    }

    // 构造 SQL 语句
    const insertSql = `
      INSERT INTO stocks (stock_name, currency, quantity, purchase_price, purchase_date,current_price, stock_code)
      VALUES ${records.map(() => '(?, ?, ?, ?, ?,?, ?)').join(', ')}
    `;

    await deleteTickersByCode(records[0].stock_code)
    const current_price = await updateTickersByCode(records[0].stock_code)

    console.log(current_price)
    // 展平参数数组
    const values = records.flatMap(record => [
      record.stock_name,
      record.currency,
      record.quantity,
      record.purchase_price,
      record.purchase_date,
      current_price,
      record.stock_code
    ]);

    await query(insertSql, values);

    res.status(201).json({ message: `${records.length} stocks record(s) inserted successfully.` });
  } catch (error) {
    console.error('Error inserting stock records:', error);
    res.status(500).json({ error: 'Failed to insert stock records.' });
  }
}

async function deleteStockRecordsById(req, res) {
  try {
    const { id } = req.body;
    console.log(id)
    // 简单校验
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing stock ID.' });
    }
    const deleteSql = 'DELETE FROM stocks WHERE id = ?';
    const result = await query(deleteSql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No stock record found with that ID.' });
    }

    res.status(200).json({ message: 'Stock record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting stock record:', error);
    res.status(500).json({ error: 'Failed to delete stock record.' });
  }
}

async function updateStockRecords(req, res) {
  try {
    const { id, stock_name, currency, quantity, purchase_price, purchase_date, stock_code } = req.body;

    // 简单校验
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing stock ID.' });
    }

    const getCurrentPriceSql = `
  SELECT close_price AS current_price
  FROM stock_data
  WHERE ticker = ?
  ORDER BY date DESC
  LIMIT 1
`;

    const current_price_return = await query(getCurrentPriceSql, [stock_code]);

    console.log(current_price_return[0].current_price)

    const current_price = current_price_return[0].current_price

    const profit_loss = (current_price - purchase_price) * quantity

    const updateSql = `
      UPDATE stocks
      SET stock_name = ?, currency = ?, quantity = ?, purchase_price = ?, purchase_date = ?, current_price = ?,profit_loss=?, stock_code = ?
      WHERE id = ?
      `

    await query(updateSql, [stock_name, currency, quantity, purchase_price, purchase_date, current_price, profit_loss, stock_code, id]);

    res.status(200).json({ message: 'Stock record updated successfully.' });
  } catch (error) {
    console.error('Error updating stock record:', error);
    res.status(500).json({ error: 'Failed to update stock record.' });
  }
}

module.exports = {
  getTickerNames,
  getTickerRecords,
  getStockTimeSeries,
  getAllStockTimeSeries,
  getStockTimeSeriesById,
  insertStockRecords,
  deleteStockRecordsById,
  updateStockRecords
};