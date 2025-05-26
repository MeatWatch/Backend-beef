import dbPool from '../config/db.js';

export const getAllById = (id) => {
    const query =`SELECT * FROM classifications WHERE user_id = ${id}`;

    return dbPool.execute(query);
}

export const addNewClassification = async(values) => {
    const query = `INSERT INTO classifications (user_id, meat_type, image_path, result, confidence_score, reminder_active, reminder_date, reminder_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    return dbPool.execute(query, values);
}

export const deleteClassification = async (user_id, id) => {
    const query = `DELETE FROM classifications WHERE user_id = ${user_id} AND classification_id = ${id}`;

    return dbPool.execute(query);
}
