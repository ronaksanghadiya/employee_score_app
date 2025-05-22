const db = require('../config/db');

exports.addScorecard = async (empId, score) => {
  const { shoulder_error, back_error, knee_error, total_error, green_percentage, red_percentage } = score;
  const [result] = await db.query(
    `INSERT INTO scorecards 
     (emp_id, shoulder_error, back_error, knee_error, total_error, green_percentage, red_percentage)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [empId, shoulder_error, back_error, knee_error, total_error, green_percentage, red_percentage]
  );
  return result;
};
