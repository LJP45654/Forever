const { query } = require('../utils/db.js');

async function getBondTimeSeries() {
  const sql = `
    SELECT DATE_FORMAT(b.start_date, '%Y-%m-%d') AS date, b.amount AS amount, b.currency
    FROM bonds b
    ORDER BY b.start_date ASC;
  `;
  return await query(sql);
}

async function getAllBondRecords(req, res) {
  try {
    const sql = `
    SELECT b.bond_name,b.rate,DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date, 
    DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,
    b.amount AS amount, b.currency,b.interest
    FROM bonds b
    ORDER BY b.start_date ASC;
  `;
  const bondRecords = await query(sql);
    res.json(bondRecords);
  } catch (error) {
    console.error('Error fetching cash records:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function addBondRecord(req, res) {
  const { bond_name, currency, amount, rate, start_date, end_date } = req.body;

  try {
    const sql = `
      INSERT INTO bonds (bond_name, currency, amount, rate, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [bond_name, currency, amount, rate, start_date, end_date]);
    res.status(201).json({ message: 'Bond record added successfully' });
  } catch (error) {
    console.error('Error adding bond record:', error);
    res.status(500).json({ error: 'Failed to add bond record' });
  }
}

async function deleteBondRecord(req, res) {
  const { id } = req.params;

  try {
    const sql = `DELETE FROM bonds WHERE id = ?`;
    await query(sql, [id]);
    res.json({ message: 'Bond record deleted successfully' });
  } catch (error) {
    console.error('Error deleting bond record:', error);
    res.status(500).json({ error: 'Failed to delete bond record' });
  }
}

async function updateBondRecord(req, res) {
  const { id } = req.params;
  const { bond_name, currency, amount, rate, start_date, end_date } = req.body;

  try {
    const sql = `
      UPDATE bonds
      SET bond_name = ?, currency = ?, amount = ?, rate = ?, start_date = ?, end_date = ?
      WHERE id = ?
    `;
    await query(sql, [bond_name, currency, amount, rate, start_date, end_date, id]);
    res.json({ message: 'Bond record updated successfully' });
  } catch (error) {
    console.error('Error updating bond record:', error);
    res.status(500).json({ error: 'Failed to update bond record' });
  }
}


module.exports ={
  getBondTimeSeries,
  getAllBondRecords,
  addBondRecord,
  deleteBondRecord,
  updateBondRecord
}