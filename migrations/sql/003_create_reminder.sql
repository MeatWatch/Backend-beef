CREATE TABLE IF NOT EXISTS Reminder (
    reminderId VARCHAR(255) PRIMARY KEY,
    classifyId VARCHAR(255) NOT NULL,
    createdAt DATETIME,
    reminderDate DATETIME,
    isReminder BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (classifyId) REFERENCES Classification(classifyId) ON DELETE CASCADE
);