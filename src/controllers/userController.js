import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAll,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmailAndPassword,
} from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await getAll();
    res.json({
      message: "GET all users success",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: err,
    });
  }
};

export const createNewUser = async (req, res) => {
  const { username, email, password, full_name = username } = req.body;
  console.log("📥 Request body:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Bad Request: username, email, and password are required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, email, hashedPassword, full_name];

    await createUser(values);

    res.status(201).json({
      message: "CREATE new users success",
    });
  } catch (err) {
    console.error("❌ Error saat register:", err);
    res.status(500).json({
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};

export const updateUserWithId = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const profile_picture = req.file.path;

  try {
    await updateUser(body, profile_picture, id);

    res.json({
      message: `UPDATE user with id_user ${id} success`,
      data: {
        user_id: id,
        ...body,
        profile_picture: profile_picture,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: err,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const values = [email];
    const [rows] = await getUserByEmailAndPassword(values);

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    const isValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: rows[0].id,
        email: rows[0].email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: {
        username: rows[0].username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: err,
    });
  }
};

// mengubah fungsi register untuk mendapatkan token dan bisa langsung auto login kalo tadi tidak dapet akses token
export const registerUser = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email, dan password wajib diisi",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await getUserByEmailAndPassword([email]);
    if (rows.length > 0) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    // fungsi ketika user ketik fullname maka username akan default
    const safeFullName = full_name || username;
    const values = [username, email, hashedPassword, safeFullName];

    const newUser = await createUser(values);

    // Auto-login: buat token dan kirim user
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "rahasia", {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "CREATE new users success",
      token,
      user: {
        username,
        email,
        full_name: safeFullName,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};
