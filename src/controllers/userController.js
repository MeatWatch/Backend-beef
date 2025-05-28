import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAll,
  createUser,
  deleteUser,
  getUserByEmail,
  getUserByEmailOrUsername,
  getUserById,
  updateUserWithoutPhoto,
  updateUserWithPhoto,
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

export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  const values = [ email, username ];

  if (!email && !username) {
    return res.status(400).json({ 
      message: "Email or Username is required"
    });
  }

  try {
    const [rows] = await getUserByEmailOrUsername(values);

    if (rows.length === 0) {
      return res.status(401).json({  
        message: "Invalid username or email",
      });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("✅ JWT generated:", token);

    return res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        no_telp: user.no_telp
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      serverMessage: err.message,
    });
  }
};

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

    const values = [ email, no_telp, username, hashedPassword ];

    await createUser(values);

    const token = jwt.sign({ email }, process.env.JWT_SECRET || "rahasia", {
      expiresIn: "1d",
    });

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

export const getProfilById = async (req, res) => {
  const id = req.user.userId;
  
  try {
    const [rows] = await getUserById(id);

    res.status(200).json({
      message: "Success get user by id",
      user: rows,
    })
  } catch (err) {
    res.status(500).json({
      message: " Server Error",
      serverMessage: err,
    })
  }
}

export const updateUserWithId = async (req, res) => {
  const id = req.user.userId;
  const { body } = req;
  const profile_picture = req.file?.path || null;

  try {
    if (profile_picture) {
      await updateUserWithPhoto(body, profile_picture, id);
    } else {
      await updateUserWithoutPhoto(body, id);
    }



    res.json({
      message: `UPDATE user with id_user ${id} success`,
      data: {
        userId: id,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: err,
    });
  }
};
