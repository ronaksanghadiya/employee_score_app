const db = require('../config/db');

exports.getEmployeeById = async (id) => {
  const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
  return rows[0];
};
