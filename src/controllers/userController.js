import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAll,
  createUser,
  getUserByEmail,
  getUserByEmailOrUsername,
  getUserById,
  updateUserWithoutPhoto,
  updateUserWithPhoto, 
  updateLastLogin,
} from "../models/userModel.js";

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

//createNewUser
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

// fetch-api nya dengan login berhasil menggubah yg tadinya meminta email menjadi username dan email dengan mengubah identifier
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  console.log(`🔐 Login attempt with identifier:`, identifier);

  try {
    const [rows] = await getUserByEmailOrUsername([identifier, identifier]);
    const user = rows[0];

    console.log("📥 DB response user:", user);

    if (!user) {
      console.warn("❌ User not found:", identifier);
      return res.status(401).json({
        message: "Invalid username or email",
      });
    }

    console.log("🧑 Selected user:", user);
    console.log("🔐 Hashed password from DB:", user.password);

    if (!password || !user.password) {
      console.warn("⚠️ Password tidak tersedia.");
      return res.status(400).json({ message: "Missing credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match status:", isValid);

    if (!isValid) {
      console.warn("❌ Invalid password for user:", identifier);
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId, // ✅ diperbaiki dari user.user.id
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await updateLastLogin(user.userId);
    console.log("✅ JWT generated:", token);

    res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
      },
    });
  } catch (err) {
    console.error("💥 Server error during login:", err);

    res.status(500).json({
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};

// registerUser
export const registerUser = async (req, res) => {
  const { email, no_telp, username, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email, dan password wajib diisi",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await getUserByEmail(email);
    if (rows.length > 0) {
      res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    const values = [email, no_telp ?? null, username, hashedPassword];
    console.log("Register values:", values);
    await createUser(values);

    // ✅ Ambil user lagi untuk mendapatkan ID-nya
    const [newUserRows] = await getUserByEmail(email);
    const newUser = newUserRows[0];

    const token = jwt.sign(
      {
        userId: newUser.userId, // ✅ tambahkan id
        email,
      },
      process.env.JWT_SECRET || "rahasia",
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      message: "CREATE new users success",
      token,
      user: {
        name: username,
        email: email,
        no_telp: no_telp,
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

//getProfilById
export const getProfilById = async (req, res) => {
  const id = req.user.userId;

  try {
    const [rows] = await getUserById(id);

    res.status(200).json({
      message: "Success get user by id",
      user: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: " Server Error",
      serverMessage: err,
    });
  }
};

export const updateUserWithId = async (req, res) => {
  try {
    console.log("💡 req.user:", req.user);
    console.log("💡 req.body:", req.body);
    console.log("💡 req.file:", req.file);
    console.log("📨 Body dari frontend:", req.body);

    const { userId } = req.user;
    const data = {
      ...req.body,
      no_telp: req.body.no_telp ?? req.body.phone ?? null, // ⬅️ tambahkan ini
    };

    let updated;
    if (req.file) {
      updated = await updateUserWithPhoto(data, req.file.filename, userId);
    } else {
      updated = await updateUserWithoutPhoto(data, userId);
    }

    if (!updated) {
      return res.status(400).json({ success: false, message: "Update failed" });
    }

    const [userRows] = await getUserById(userId);
    const user = userRows[0];

    res.json({ success: true, user });
  } catch (error) {
    console.error("🔥 ERROR UPDATE PROFILE:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};