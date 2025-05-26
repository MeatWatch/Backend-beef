import { addNewClassification, deleteClassification, getAllById } from "../models/classificationModel.js";

export const getAllClassification = async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const [rows] = await getAllById(user_id);
    res.json({
      message: "GET all classfication success",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server Error",
      serverMessage: err
    });
  }
};

export const addClassification = async (req, res) => {
  const { user_id } = req.params;
  const  image_path = req.file.path;
  const reminder_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const {
    meat_type,
    result,
    confidence_score,
    reminder_active,
    reminder_message,
  } = req.body;

  try {
    const values = [user_id, meat_type, image_path, result, confidence_score, reminder_active, reminder_date, reminder_message]

    await addNewClassification(values);
    res.status(201);
  } catch (err) {
    res.status(500);
  }
};

export const deleteClassificationById = async (req, res) => {
  const { user_id } = req.params;
  const { id } = req.query;

  try {
    await deleteClassification(user_id, id);
    res.json({
      message: `DELETE classification with id_user ${id} success`,
    })
  } catch (err) {
    res.status(500).json({ 
      message: 'Server Error',
      serverMessage: err,
    });
  }
}
