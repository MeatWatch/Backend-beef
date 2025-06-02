import { createNewReminder, getAllReminder } from "../models/reminderModel"

// Get all reminder
export const getAllReminderBeef = async (req, res) => {
    try {
        const [rows] = await getAllReminder();

        return res.status(200).json({
            success: true,
            message: "GET all reminder success",
            data: rows,
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Server Error",
            serverMessage: err
        });
    }
} 

// Add reminder to database
export const addReminder = async (req, res) => {
    const { reminderId, createdAt, classifyId, userId } = req.body;
    
    try {
        const values = [reminderId, createdAt, classifyId, userId];
        await createNewReminder(values);

        return res.status(201).json({
            success: true,
            message: "POST reminder success",
            data: {
                userId: userId,
                classifyId: classifyId,
                reminderId: reminderId,
                createdAt: createdAt,
            }
        })
    } catch (error) {
        return res.status(500).json({ 
            return: false,
            message: "Server Error",
            serverMessage: err
        });
    }
}