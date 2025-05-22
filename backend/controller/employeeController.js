// controllers/employeeController.js

const db = require('../config/db'); // This should be your configured MySQL connection


exports.addEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, job_code, designation } = req.body;

    if (!first_name || !last_name || !email || !phone_number) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if email already exists
    const [existingEmployee] = await db.query(
      'SELECT id FROM employees WHERE email = ?',
      [email]
    );

    if (existingEmployee.length > 0) {
      return res.status(409).json({ message: 'Email is already taken. Please use a different one.' });
    }

    // Proceed to insert employee
    const [result] = await db.query(
      `INSERT INTO employees (
        first_name, 
        last_name, 
        email, 
        phone_number, 
        job_code, 
        designation
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        job_code,
        designation
      ]
    );

    return res.status(201).json({
      message: 'Employee added successfully',
    });

  } catch (error) {
    console.error('Error inserting employee:', error);
    return res.status(500).json({ message: 'Failed to add employee' });
  }
};




exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  const employeeQuery = 'SELECT * FROM employees WHERE id = ?';
  const scorecardQuery = 'SELECT * FROM scorecards WHERE emp_id = ?';

  try {
    const [employeeRows] = await db.query(employeeQuery, [id]);

    if (employeeRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const [scorecardRows] = await db.query(scorecardQuery, [id]);

    return res.status(200).json({
      ...employeeRows[0],
      scorecard: scorecardRows[0] || null, // if no scorecard, return null
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllEmployees = async (req, res) => {
  const query = 'SELECT * FROM employees';

  try {
    const [rows] = await db.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// controllers/scorecardController.js
exports.submitScorecard = async (req, res) => {
  const { id } = req.params;
  const {
    shoulder_error,
    back_error,
    knee_error,
    total_error,
    green_percentage,
    red_percentage
  } = req.body;

  try {
    // Check if scorecard already exists for the employee
    const [rows] = await db.query('SELECT * FROM scorecards WHERE emp_id = ?', [id]);

    if (rows.length > 0) {
      // Update existing scorecard
      await db.query(`
        UPDATE scorecards SET 
          shoulder_error = ?, 
          back_error = ?, 
          knee_error = ?, 
          total_error = ?, 
          green_percentage = ?, 
          red_percentage = ?
        WHERE emp_id = ?
      `, [
        shoulder_error,
        back_error,
        knee_error,
        total_error,
        green_percentage,
        red_percentage,
        id
      ]);
      return res.status(200).json({ message: 'Scorecard updated' });
    } else {
      // Insert new scorecard
      await db.query(`
        INSERT INTO scorecards (
          emp_id, 
          shoulder_error, 
          back_error, 
          knee_error, 
          total_error, 
          green_percentage, 
          red_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        shoulder_error,
        back_error,
        knee_error,
        total_error,
        green_percentage,
        red_percentage
      ]);
      return res.status(201).json({ message: 'Scorecard added' });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM employees WHERE id = ?';

  try {
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone_number, designation } = req.body;

  const query = `
    UPDATE employees 
    SET first_name = ?, last_name = ?, email = ?, phone_number = ?, designation = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(query, [
      first_name, last_name, email, phone_number, designation, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
