import dbPool from '../config/db.js';

// Get all classification
export const getAllClassify = () => {
    const query = `SELECT * FROM Classification`;

    return dbPool.execute(query);
}

// Get all classification by userId
export const getAllByUserId = (id) => {
    const query = `SELECT Classification.*, Reminder.reminderDate 
    FROM Classification, Reminder
    WHERE Classification.classifyId = Reminder.classifyId
    AND userId = ?`;

    return dbPool.execute(query, [id]);
}

// Get all classification by classifyId
export const getClassifyByClassifyId = (id) => {
    const query = `SELECT * FROM Classification WHERE classifyId = ?`;

    return dbPool.execute(query, [id]);
}

// add classification to database
export const createNewClassification = async(values) => {
    const query = `INSERT INTO Classification (classifyId, userId, meat_type, status, confidence, image_beef, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    return dbPool.execute(query, values);
}

// delete classification by classifyId
export const deleteClassificationById = async (classifyId) => {
    const query = `DELETE FROM Classification WHERE classifyId = ?`;

    return dbPool.execute(query, [classifyId]   );
}
