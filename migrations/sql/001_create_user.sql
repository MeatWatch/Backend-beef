CREATE TABLE IF NOT EXISTS User (
    userId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_telp VARCHAR(20),
    profile_picture VARCHAR(255),
    address TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    last_login DATETIME
);