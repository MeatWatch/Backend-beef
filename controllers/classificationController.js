import db from "../config/db.js";

export const getAllClassifications = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM classifications");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createClassification = async (req, res) => {
  const {
    user_id,
    meat_type,
    image_path,
    result,
    confidence_score,
    reminder_active,
    reminder_date,
    reminder_message,
  } = req.body;

  try {
    const [resultDb] = await db.query(
      `INSERT INTO classifications (
        user_id, meat_type, image_path, result,
        confidence_score, reminder_active, reminder_date, reminder_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        meat_type,
        image_path,
        result,
        confidence_score,
        reminder_active || false,
        reminder_date || null,
        reminder_message || null,
      ]
    );

    res.status(201).json({ id: resultDb.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
