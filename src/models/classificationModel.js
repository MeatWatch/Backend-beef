import dbPool from '../config/db.js';

export const getAllClassify = () => {
    const query = `SELECT * FROM Classification`;

    return dbPool.execute(query);
}

export const getAllByUserId = (id) => {
    const query = `SELECT * FROM Classification WHERE userId = ?`;

    return dbPool.execute(query, [id]);
}

export const getClassifyByClassifyId = (id) => {
    const query = `SELECT * FROM Classification WHERE classifyId = ?`;

    return dbPool.execute(query, [id]);
}

export const createNewClassification = async(values) => {
    const query = `INSERT INTO Classification (classifyId, userId, meat_type, status, confidence, image_beef) VALUES (?, ?, ?, ?, ?, ?)`;

    return dbPool.execute(query, values);
}

export const deleteClassificationById = async (classifyId) => {
    const query = `DELETE FROM Classification WHERE classifyId = ?`;

    return dbPool.execute(query, [classifyId]   );
}
