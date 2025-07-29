const { query } = require('../utils/db.js');

async function getAllCashRecords(req, res) {
  try {
    const cashRecords = await query('SELECT * FROM cash');
    res.json(cashRecords);
  } catch (error) {
    console.error('Error fetching cash records:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getBalanceSnapshot(req, res) {
  try {
    const sql = `
      SELECT s.currency, s.balance AS balance, ROUND(s.balance * er.rate_to_cny, 2) AS balance_cny
      FROM exchange_rates er, cash_snapshot s
      WHERE s.currency = er.currency_code
    `;
    const balances = await query(sql);
    res.json(balances);
  } catch (error) {
    console.error('Error calculating balances:', error);
    res.status(500).json({ error: 'Failed to calculate balances' });
  }
}

async function updateBalanceSnapshot() {
  try {
    const balanceResult = await query(`
      SELECT currency, SUM(delta_amount) AS balance
      FROM cash
      GROUP BY currency
    `);

    await query('DELETE FROM cash_snapshot');

    for (const { currency, balance } of balanceResult) {
      await query(
        `INSERT INTO cash_snapshot (currency, balance)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
         balance = VALUES(balance), timestamp = CURRENT_TIMESTAMP`,
        [currency, balance]
      );
    }

    console.log('Balance snapshot updated successfully.');
  } catch (error) {
    console.error('Error updating balance snapshot:', error);
  }
}

async function insertCashRecords(req, res) {
  try {

    const cashRecords = req.body;
    
    if (!Array.isArray(cashRecords)) {
      return res.status(400).json({ error: 'Expected an array of records' });
    }
    
    const invalidRecords = cashRecords.filter(record => {
      return !record.currency || record.delta_amount === undefined;
    });
    
    if (invalidRecords.length > 0) {
      return res.status(400).json({ 
        error: 'Some records are missing required fields (currency, delta_amount)',
        invalidRecords 
      });
    }
    
    const sql = `INSERT INTO cash (timestamp, currency, delta_amount, note) VALUES ?`;
    
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const values = cashRecords.map(record => [
      currentTime,  // 使用当前时间
      record.currency,
      record.delta_amount,
      record.note || null  // 如果note不存在则插入NULL
    ]);
    
    const result = await query(sql, [values]);

    updateBalanceSnapshot();
    
    res.json({
      success: true,
      message: 'Records inserted successfully',
      insertedCount: result.affectedRows
    });
    
  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }
}

async function deleteCashRecords(req, res) {
  try {

    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Expected an array of ids' });
    }
    
    if (ids.length === 0) {
      return res.status(400).json({ error: 'Ids array cannot be empty' });
    }
    
    const invalidIds = ids.filter(id => {
      return isNaN(id) || id <= 0;
    });
    
    if (invalidIds.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid ids found. All ids must be positive numbers',
        invalidIds 
      });
    }
    
    const sql = `DELETE FROM cash WHERE id IN (?)`;
    
    const result = await query(sql, [ids]);

    updateBalanceSnapshot();
    
    res.json({
      success: true,
      message: 'Records deleted successfully',
      deletedCount: result.affectedRows
    });
    
  } catch (error) {
    console.error('Error deleting cash records:', error);
    res.status(500).json({ error: 'Failed to delete records' });
  }
}


module.exports = {
  getAllCashRecords,
  getBalanceSnapshot,
  updateBalanceSnapshot,
  insertCashRecords,
  deleteCashRecords
}