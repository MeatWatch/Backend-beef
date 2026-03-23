CREATE TABLE IF NOT EXISTS Classification (
    classifyId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    meat_type VARCHAR(100),
    status VARCHAR(100),
    confidence FLOAT,
    image_beef VARCHAR(255),
    createdAt DATETIME,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);