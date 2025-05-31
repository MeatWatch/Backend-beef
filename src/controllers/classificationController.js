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

export const getAllClassification = async (req, res) => {
  try {
    const [rows] = await getAllClassify();
    res.status(200).json({
      message: "GET all classfication by user id success",
      data: rows,
    });
  } catch (err) {
      res.status(500).json({ 
        message: "Server Error",
        serverMessage: err
      });
  }
};

export const getAllClassfyByIdUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await getAllByUserId(userId);

    res.json({
      message: `GET all classification with userId: ${userId}`,
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error",
      serverMessage: error
    });
  }
}

export const addClassification = async (req, res) => {
  const { userId } = req.user;
  const  image_beef = req.file.path;
  const { meat_type, status, confidence } = req.body;
  const classifyId = nanoid(10);
  const reminderId = nanoid(10);

  try {
    const values_classify = [classifyId, userId, meat_type, status, confidence, image_beef];
    
    await createNewClassification(values_classify);

    const [rows] = await getClassifyByClassifyId(classifyId);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Classification not found"
      })
    }
    
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const createdAt = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const reminderDate = await createReminderDate(classifyId);

    const values_reminder = [reminderId, classifyId, createdAt, reminderDate];
    await createNewReminder(values_reminder);

    return res.json({
      message: "POST Succes",
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Server Error",
      serverMessage: err
    });
  }
};
