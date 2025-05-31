import { createNewReminder, getAllReminder } from "../models/reminderModel"

export const getAllReminderBeef = async (req, res) => {
    try {
        const [rows] = await getAllReminder();

        return res.status(200).json({
            message: "GET all reminder success",
            data: rows,
        })
    } catch (error) {
        return res.status(500).json({ 
            message: "Server Error",
            serverMessage: err
        });
    }
} 

export const addReminder = async (req, res) => {
    const { reminderId, createdAt, classifyId, userId } = req.body;
    
    try {
        const values = [reminderId, createdAt, classifyId, userId];
        await createNewReminder(values);

        return res.status(200).json({
            message: "POST reminder success",
        })
    } catch (error) {
        return res.status(500).json({ 
            message: "Server Error",
            serverMessage: err
        });
    }
}