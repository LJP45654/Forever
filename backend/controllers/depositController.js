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
    const sql = `SELECT * FROM deposit`;

    const result = await query(sql);
    const formattedResult = result.map(record => ({
      ...record,
      start_date: record.start_date ? record.start_date.toISOString().split('T')[0] : null,
      end_date: record.end_date ? record.end_date.toISOString().split('T')[0] : null,
    }));

    res.json(formattedResult);

  } catch (error) {
    console.error('Error fetching deposit records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
}

async function insertDepositRecord(req, res) {
  try {
    const { start_date, principal, currency, end_date, interest_rate, description } = req.body;

    // 验证必要字段
    if (!start_date || !principal || !currency) {
      return res.status(400).json({
        error: 'Missing required fields: start_date, principal, and currency are required'
      });
    }

    const sql = `
      INSERT INTO deposit 
      (start_date, principal, currency, end_date, interest_rate, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [start_date, principal, currency, end_date, interest_rate, description]);

    res.status(201).json({
      success: true,
      message: 'Deposit record created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error inserting deposit record:', error);
    res.status(500).json({ error: 'Failed to insert deposit record' });
  }
}

async function deleteDepositRecordById(req, res) {
  try {
    const { id } = req.params;

    // 验证ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing deposit ID' });
    }

    // 首先检查记录是否存在
    const checkSql = 'SELECT * FROM deposit WHERE id = ?';
    const existingRecord = await query(checkSql, [id]);

    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Deposit record not found' });
    }

    const sql = 'DELETE FROM deposit WHERE id = ?';
    const result = await query(sql, [id]);

    res.json({
      success: true,
      message: 'Deposit record deleted successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting deposit record:', error);
    res.status(500).json({ error: 'Failed to delete deposit record' });
  }
}

async function updateDepositRecordById(req, res) {
  try {
    const { id } = req.params;
    const { start_date, principal, currency, end_date, interest_rate, description } = req.body;

    // 验证ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing deposit ID' });
    }

    // 验证至少有一个字段要更新
    if (!start_date && !principal && !currency && !end_date && !interest_rate && !description) {
      return res.status(400).json({
        error: 'No fields provided for update'
      });
    }

    // 首先检查记录是否存在
    const checkSql = 'SELECT * FROM deposit WHERE id = ?';
    const existingRecord = await query(checkSql, [id]);

    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Deposit record not found' });
    }

    // 构建动态更新SQL
    let updateFields = [];
    let updateValues = [];

    if (start_date) {
      updateFields.push('start_date = ?');
      updateValues.push(start_date);
    }
    if (principal) {
      updateFields.push('principal = ?');
      updateValues.push(principal);
    }
    if (currency) {
      updateFields.push('currency = ?');
      updateValues.push(currency);
    }
    if (end_date) {
      updateFields.push('end_date = ?');
      updateValues.push(end_date);
    }
    if (interest_rate) {
      updateFields.push('interest_rate = ?');
      updateValues.push(interest_rate);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    // 添加ID到更新值数组
    updateValues.push(id);

    const sql = `
      UPDATE deposit 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;

    const result = await query(sql, updateValues);

    res.json({
      success: true,
      message: 'Deposit record updated successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating deposit record:', error);
    res.status(500).json({ error: 'Failed to update deposit record' });
  }
}

module.exports = {
  getDepositTimeSeries,
  getAllDepositRecord,
  insertDepositRecord,
  deleteDepositRecordById,
  updateDepositRecordById
};