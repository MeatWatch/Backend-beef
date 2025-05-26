import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAll,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmailAndPassword,
  getUserByEmailOrUsername,
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

// fetch-api nya dengan login berhasil menggubah yg tadinya meminta email menjadi username dan email dengan mengubah identifier
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  console.log(`🔐 Login attempt with identifier:`, identifier);

  try {
    // Ambil user dari DB
    const user = await getUserByEmailOrUsername(identifier);

    console.log("📥 DB response user:", user);

    if (!user) {
      console.warn("❌ User not found:", identifier);
      return res.status(401).json({
        message: "Invalid username or email",
      });
    }

    // Verifikasi password
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log("🔐 Password match status:", isValid);

    if (!isValid) {
      console.warn("❌ Invalid password for user:", identifier);
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Buat token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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

// // GET /auth/me - Get current user info from token
// export const getMe = (req, res) => {
//   try {
//     const user = req.user; // req.user di-set oleh authMiddleware
//     if (!user) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Something went wrong", error: err.message });
//   }
// };
