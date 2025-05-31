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
  const query = `
    INSERT INTO User (email, no_telp, username, password, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;

  return dbPool.execute(query, values);
};

// UpdateUserWithPhoto
export const updateUserWithPhoto = (body, profile_picture, id) => {
  const allowedField = ["email", "username", "no_telp", "address"];

  const field = [];
  const values = [];

  // Pastikan penanganan null/undefined
  allowedField.forEach((key) => {
    if (body[key] !== undefined) {
      // Hanya proses jika field ada
      field.push(`${key} = ?`);
      values.push(body[key] !== null ? body[key] : null);
    }
  });

  if (profile_picture) {
    field.push(`profile_picture = ?`);
    values.push(profile_picture);
  }

  // Tambahkan updated_at
  field.push(`updated_at = NOW()`); // ✅ otomatis update waktu

  if (field.length === 0) {
    throw new Error("Tidak ada data yang di update");
  }

  const query = `UPDATE User SET ${field.join(", ")} WHERE userId = ?`;
  values.push(id);

  console.log("Query Update:", query);
  console.log("Values:", values);

  return dbPool.execute(query, values);
};

//Update tanpa foto
export const updateUserWithoutPhoto = (body, id) => {
  const allowedField = ["email", "username", "no_telp", "address"];

  const field = [];
  const values = [];

  for (const key of allowedField) {
    const value = body[key] !== undefined ? body[key] : null;
    field.push(`${key} = ?`);
    values.push(value);
  }

  field.push(`updated_at = NOW()`); // ✅ otomatis update waktu

  if (field.length === 0) {
    throw new Error("Tidak ada data yang di update");
  }

  const query = `UPDATE User SET ${field.join(", ")} WHERE userId = ?`;
  values.push(id); // ✅ penting

  return dbPool.execute(query, values);
};

//Update last Login
export const updateLastLogin = async (id) => {
  const query = `UPDATE User SET last_login = NOW() WHERE userId = ?`;
  return dbPool.execute(query, [id]);
};