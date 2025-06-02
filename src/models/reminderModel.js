import dbPool from '../config/db.js';

//  Get all reminder
export const getAllReminder = () => {
    const query = `SELECT * FROM Reminder`;

    return dbPool.execute(query);
}

// Get data user and classification to reminder job
export const getDataForReminder = (date) => {
    const query = `SELECT  Reminder.reminderId, Classification.classifyId, User.username, User.email, Classification.meat_type, Reminder.createdAt
    FROM User, Classification, Reminder 
    WHERE User.userId = Classification.userId
    AND Classification.classifyId = Reminder.classifyId
    AND ReminderDate <= ?
    AND isReminder = 0`;

    return dbPool.execute(query, [date]);
}

// Add reminder to database
export const createNewReminder  = (values) => {
    const query = `INSERT INTO Reminder (reminderId, classifyId, createdAt, reminderDate) VALUES (?, ?, ?, ?)`;

    return dbPool.execute(query, values);
}

// Update isReminder
export const updateIsReminder = (id) => {
    const query= `UPDATE Reminder SET isReminder = TRUE WHERE reminderId = ?`;

    return dbPool.execute(query, [id]);
}  

// Deleter reminder
export const deleteReminderByIsReminder = () => {
    const query = `DELETE FROM Reminder WHERE isReminder = TRUE`;

    return dbPool.execute(query);
}

