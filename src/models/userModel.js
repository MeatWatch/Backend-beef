import dbPool from "../config/db.js";

export const getAll = () => {
  const query = `SELECT * FROM User`;

  return dbPool.execute(query);
};

export const getUserByEmail = (email) => {
  const query = `SELECT * FROM User WHERE email = '${email}'`;

  return dbPool.execute(query);
};

export const getUserByEmailOrUsername = async (values) => {
  const query = `SELECT * FROM User WHERE email = ? OR username = ?`;

  return dbPool.execute(query, values);
};

export const getUserById = async (id) => {
  const query = `SELECT * FROM User WHERE userId = ${id}`;

  return dbPool.execute(query);
}

export const createUser = async (values) => {
  const query = `INSERT INTO User (email, no_telp, username, password) VALUES (?, ?, ?, ?)`;

  return dbPool.execute(query, values);
};

export const updateUserWithPhoto = (body, profile_picture, id) => {
  const allowedField = ['email', 'username', 'no_telp'];

  const field = [];
  const values = [];

  for (const key of allowedField) {
    if (body[key]) {
      field.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (profile_picture) {
    field.push(`profile_picture = ?`);
    values.push(profile_picture);
  }

  if (field.length === 0) {
    throw new Error("Tidak ada data yang di update");
  }

  const query = `UPDATE User set ${field.join(", ")} WHERE userId = ${id}`;

  return dbPool.execute(query, values);
};

export const updateUserWithoutPhoto = (body, id) => {
  const allowedField = ['email', 'username', 'no_telp'];

  const field = [];
  const values = [];

  for (const key of allowedField) {
    if (body[key]) {
      field.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (field.length === 0) {
    throw new Error("Tidak ada data yang di update");
  }

  const query = `UPDATE User set ${field.join(", ")} WHERE userId = ${id}`;

  return dbPool.execute(query, values);
};

export const deleteUser = async (id) => {
  const query = `DELETE FROM User WHERE userId = ${id}`;

  return dbPool.execute(query);
};
