import dbPool from "../config/db.js";

//Get all
export const getAll = () => {
  const query = `SELECT * FROM User`;

  return dbPool.execute(query);
};

//getUserByemail
export const getUserByEmail = (email) => {
  const query = `SELECT * FROM User WHERE email = ?`;

  return dbPool.execute(query, [email]);
};

//get userByemail
export const getUserByEmailOrUsername = async (values) => {
  const query = `SELECT * FROM User WHERE email = ? OR username = ?`;

  return dbPool.execute(query, values);
};

//Get Id
export const getUserById = async (id) => {
  const query = `SELECT * FROM User WHERE userId = ?`;
  return dbPool.execute(query, [id]);
};

//Create User
export const createUser = async (values) => {
  const query = `INSERT INTO User (userId, email, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;

  return dbPool.execute(query, values);
};

// Update user
export const updateWithUserId = (values) => {
  const query = `UPDATE User SET 
  email = ?, no_telp = ?, username = ?, password = ?, profile_picture = ?, address = ?, created_at = ?, updated_at = ?, last_login = ?
  WHERE userId = ?`;

  return dbPool.execute(query, values)
}

//Update last Login
export const updateLastLogin = async (id) => {
  const query = `UPDATE User SET last_login = NOW() WHERE userId = ?`;
  return dbPool.execute(query, [id]);
};