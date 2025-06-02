import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';  
import { createNewReminder } from '../models/reminderModel.js';
import { createReminderDate } from '../middleware/reminderMiddleware.js';
import { 
  createNewClassification,  
  getAllByUserId, 
  getAllClassify, 
  getClassifyByClassifyId 
} from "../models/classificationModel.js";

// Get all classification
export const getAllClassification = async (req, res) => {
  try {
    const [rows] = await getAllClassify();
    return res.status(200).json({
      success: true,
      message: "GET all classfication by user id success",
      data: rows,
    });
  } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: "Server Error",
        serverMessage: err
      });
  }
};

// Get all classification by userId
export const getAllClassfyByUserId = async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await getAllByUserId(userId);

    return res.status(200).json({
      success: true,
      message: `GET all classification with userId: ${userId}`,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Server Error",
      serverMessage: error
    });
  }
}

// Add classification to database
export const addClassification = async (req, res) => {
  const { userId } = req.user;

  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "Image not found in request" 
    });
  }

  const image_beef = req.file.path;
  const { meat_type, status, confidence } = req.body;

  const classifyId = nanoid(10);
  const reminderId = nanoid(10);

  try {
    const values_classify = [
      classifyId,
      userId,
      meat_type,
      status,
      confidence,
      image_beef,
    ];

    
    if (values_classify.includes(undefined)) {
      return res.status(400).json({
        message: "❌ There is incomplete data",
        debug: values_classify,
      });
    }
    console.log("values_classify:", values_classify);
    
    await createNewClassification(values_classify);

    const [rows] = await getClassifyByClassifyId(classifyId);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Classification not found" 
      });
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    const createdAt = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const reminderDate = await createReminderDate(classifyId);

    const values_reminder = [reminderId, classifyId, createdAt, reminderDate];
    await createNewReminder(values_reminder);

    return res.status(201).json({
      success: true, 
      message: "POST Success" 
    });
  } catch (err) {
    console.error("❌ Error saving classification:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};
