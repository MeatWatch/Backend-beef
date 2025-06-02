import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAll,
  getUserByEmail,
  getUserByEmailOrUsername,
  getUserById,
  createUser,
  updateWithUserId,
  updateLastLogin,
} from "../models/userModel.js";

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

// GetAllUsers
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

//getProfilById
export const getProfilById = async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await getUserById(userId);

    res.status(200).json({
      success: true,
      message: "Success get user by id",
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: " Server Error",
      serverMessage: err,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const [rows] = await getUserByEmailOrUsername([identifier, identifier]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({
        message: "Invalid username or email",
      });
    }

    if (!password || !user.password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        no_telp: user.no_telp,
        username: user.username,
        password: user.password,
        profile_picture: user.profile_picture,
        address: user.address,
        created_at: user.created_at, 
        updated_at: user.updated_at,
        last_login: user.last_login,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await updateLastLogin(user.userId);
    console.log("✅ JWT generated:", token);

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token: token,
      user: {
        userId: user.userId,
        email: user.email,
        no_telp: user.no_telp,
        username: user.username,
        profile_picture: user.profile_picture,
        address: user.address,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      }
    });
  } catch (err) {
    console.error("🔥 Register error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};

// registerUser
export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email and password are required",
    });
  }

  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [rows] = await getUserByEmail(email);
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email has been registered",
      });
    }
    const userId = nanoid(10);

    const values = [userId, email, username, hashedPassword];
    await createUser(values);

    res.status(201).json({
      success: true,
      message: "CREATE new users success",
      user: {
        name: username,
        email: email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};


// update user
export const updateUserWithUserId = async (req, res) => {
  const { userId, password } = req.user;
  const { email, no_telp, username, address, remove_avatar } = req.body;
  const now = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
  const updated_at = now;
  
  try {
    const [rows] = await getUserById(userId);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const user = rows[0];
    const created_at = dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss');
    const last_login = dayjs(user.last_login).format('YYYY-MM-DD HH:mm:ss');

    let profile_picture = user.profile_picture;

    if (req.file) {
      profile_picture = req.file.filename;
    }

    if (remove_avatar === "true") {
      profile_picture = null;
    }

    const values = [
      email ?? user.email,
      no_telp ?? user.no_telp,
      username ?? user.username,
      password,
      profile_picture,
      address ?? user.address,
      created_at,
      updated_at,
      last_login,
      userId
    ];

    await updateWithUserId(values);

    const [updatedRows] = await getUserById(userId);
    const updatedUser = updatedRows[0];

    return res.status(200).json({
      success: true,
      message: 'Update Success',
      user: updatedUser,
    });

  } catch (error) {
    console.error("❌ PATCH Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};