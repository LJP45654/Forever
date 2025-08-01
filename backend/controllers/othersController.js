const { query } = require('../utils/db');

async function getOthersTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(o.purchase_date, '%Y-%m-%d') AS date, o.purchase_amount AS amount, o.currency
    FROM others o
    ORDER BY o.purchase_date ASC;
  `;
  return await query(sql);
}

async function addOtherRecord(req, res) {
  const { name, currency, purchase_amount, purchase_date, current_amount } = req.body;

  try {
    const sql = `
      INSERT INTO others (name, currency, purchase_amount, purchase_date, current_amount)
      VALUES (?, ?, ?, ?, ?)
    `;
    await query(sql, [name, currency, purchase_amount, purchase_date, current_amount]);
    res.status(201).json({ message: 'Record added successfully' });
  } catch (error) {
    console.error('Error adding record to others:', error);
    res.status(500).json({ error: 'Failed to add record' });
  }
}

async function deleteOtherRecord(req, res) {
  const  {id}  = req.body;

  try {
    const sql = `DELETE FROM others WHERE id = ?`;
    await query(sql, [id]);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record from others:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
}

async function updateOtherRecord(req, res) {
  const  {id}  = req.body;
  const { name, currency, purchase_amount, purchase_date, current_amount } = req.body;

  try {
    const sql = `
      UPDATE others 
      SET name = ?, currency = ?, purchase_amount = ?, purchase_date = ?, current_amount = ?
      WHERE id = ?
    `;
    await query(sql, [name, currency, purchase_amount, purchase_date, current_amount, id]);
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record in others:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
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

module.exports = { getOthersTimeSeries,getAllOtherRecords,updateOtherRecord,deleteOtherRecord,addOtherRecord };