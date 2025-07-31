const { query } = require('../utils/db');

async function getFundTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(f.purchase_date, '%Y-%m-%d') AS date, f.purchase_price * f.units AS amount, f.currency
    FROM funds f
    ORDER BY f.purchase_date ASC;
  `;
  return await query(sql);
}

async function getAllFundRecord(req, res) {
  try {
    const sql = `
     SELECT * FROM funds
     `;
    const result = await query(sql);
    const formattedResult = result.map(record => ({
      ...record,
      purchase_date: record.purchase_date ? record.purchase_date.toISOString().split('T')[0] : null,
    }));

    res.json(formattedResult);

  } catch (error) {
    console.error('Error inserting cash records:', error);
    res.status(500).json({ error: 'Failed to insert records' });
  }

}

async function deleteFundRecordById(req, res) {
  try {
    const { id } = req.params;
    
    // 验证ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing fund ID' });
    }
    
    // 检查记录是否存在
    const checkSql = 'SELECT * FROM funds WHERE id = ?';
    const existingRecord = await query(checkSql, [id]);
    
    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Fund record not found' });
    }
    
    // 删除记录
    const deleteSql = 'DELETE FROM funds WHERE id = ?';
    const result = await query(deleteSql, [id]);
    
    res.json({ 
      success: true, 
      message: 'Fund record deleted successfully',
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error('Error deleting fund record:', error);
    res.status(500).json({ error: 'Failed to delete fund record' });
  }
}

async function updateFundRecordById(req, res) {
  try {
    const { id } = req.params;
    const { fund_name, units, purchase_price, currency, purchase_date, description } = req.body;
    
    // 验证ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing fund ID' });
    }
    
    // 验证至少有一个字段要更新
    if (!fund_name && !units && !purchase_price && !currency && !purchase_date && !description) {
      return res.status(400).json({ 
        error: 'No fields provided for update' 
      });
    }
    
    // 检查记录是否存在
    const checkSql = 'SELECT * FROM funds WHERE id = ?';
    const existingRecord = await query(checkSql, [id]);
    
    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Fund record not found' });
    }
    
    // 构建动态更新SQL
    let updateFields = [];
    let updateValues = [];
    
    if (fund_name) {
      updateFields.push('fund_name = ?');
      updateValues.push(fund_name);
    }
    if (units) {
      updateFields.push('units = ?');
      updateValues.push(units);
    }
    if (purchase_price) {
      updateFields.push('purchase_price = ?');
      updateValues.push(purchase_price);
    }
    if (currency) {
      updateFields.push('currency = ?');
      updateValues.push(currency);
    }
    if (purchase_date) {
      updateFields.push('purchase_date = ?');
      updateValues.push(purchase_date);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    
    // 添加ID到更新值数组
    updateValues.push(id);
    
    const updateSql = `
      UPDATE funds 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    const result = await query(updateSql, updateValues);
    
    // 获取更新后的记录
    const updatedRecordSql = 'SELECT * FROM funds WHERE id = ?';
    const updatedRecord = await query(updatedRecordSql, [id]);
    
    // 格式化日期
    const formattedRecord = updatedRecord.map(record => ({
      ...record,
      purchase_date: record.purchase_date ? record.purchase_date.toISOString().split('T')[0] : null,
    }))[0];
    
    res.json({ 
      success: true, 
      message: 'Fund record updated successfully',
      record: formattedRecord 
    });
  } catch (error) {
    console.error('Error updating fund record:', error);
    res.status(500).json({ error: 'Failed to update fund record' });
  }
}

async function insertFundRecord(req, res) {
  try {
    const { fund_name, units, purchase_price, currency, purchase_date, description } = req.body;
    
    // 验证必要字段
    if (!fund_name || !units || !purchase_price || !currency || !purchase_date) {
      return res.status(400).json({ 
        error: 'Missing required fields: fund_name, units, purchase_price, currency, and purchase_date are required' 
      });
    }
    
    const insertSql = `
      INSERT INTO funds 
      (fund_name, units, purchase_price, currency, purchase_date, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(insertSql, [fund_name, units, purchase_price, currency, purchase_date, description]);
    
    // 获取插入的记录
    const insertedRecordSql = 'SELECT * FROM funds WHERE id = ?';
    const insertedRecord = await query(insertedRecordSql, [result.insertId]);
    
    // 格式化日期
    const formattedRecord = insertedRecord.map(record => ({
      ...record,
      purchase_date: record.purchase_date ? record.purchase_date.toISOString().split('T')[0] : null,
    }))[0];
    
    res.status(201).json({ 
      success: true, 
      message: 'Fund record created successfully',
      record: formattedRecord 
    });
  } catch (error) {
    console.error('Error inserting fund record:', error);
    res.status(500).json({ error: 'Failed to insert fund record' });
  }
}

module.exports = { getFundTimeSeries,getAllFundRecord, deleteFundRecordById, updateFundRecordById, insertFundRecord};