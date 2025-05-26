import dbPool from '../config/db.js';

export const getAll = () => {
    const query = `SELECT * FROM users`;

    return dbPool.execute(query);
}

export const getUserByEmailAndPassword = (values) => {
    const query = `SELECT * FROM users WHERE email = ?`;

    return dbPool.execute(query, values);
}

export const createUser = async(values) => {
    const query = `INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)`;

    return dbPool.execute(query, values);
}

export const updateUser = (body, profile_picture, id) => {
    const allowedField = ['username', 'email'];

    const field = [];
    const values = [];

    for (const key of allowedField) {
        if  (body[key]) {
            field.push(`${key} = ?`);
            values.push(body.key);
        }
    }

    if (profile_picture) {
        field.push(`profile_picture = ?`);
        values.push(profile_picture);
    }

    if (field.length === 0) {
        throw new Error('Tidak ada data yang di update');
    }

    const query = `UPDATE users set ${field.join(', ')} WHERE user_id=${id}`;

    return dbPool.execute(query, values);
}

export const deleteUser = async (id) => {
    const query = `DELETE FROM users WHERE user_id = ${id}`;

    return dbPool.execute(query);
}



