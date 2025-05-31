import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Konfigurasi penyimpanan file untuk upload gambar profil pengguna
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users/");
  },
  // Menentukan nama file yang disimpan dengan format timestamp-namaAsliFile
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

// Filter file yang diperbolehkan untuk diunggah
const filter = (req, file, cb) => {
  const allowedType = ["image/jpg", "image/jpeg", "image/png"];

  // Hanya izinkan file dengan tipe JPG, JPEG, dan PNG
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG and png files are allowed"), false);
  }
};

/**
 * Middleware untuk menangani upload gambar profil pengguna.
 * Menggunakan konfigurasi penyimpanan dan filter tipe file.
 */
export const uploadProfilePicture = multer({
  storage: storage,
  fileFilter: filter,
});

/**
 * Middleware untuk otentikasi JWT.
 * Mengecek apakah user memiliki token yang valid sebelum mengakses route selain /login dan /register.
 */
export const authMiddleware = (req, res, next) => {
  if (req.path === "/login" || req.path === "/register") return next();

  const authHeader = req.headers.authorization;

  // Jika tidak ada token atau formatnya salah
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided or invalid format",
    });
  }

  const token = authHeader.split(" ")[1].trim();
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    // Verifikasi token dengan secret dari environment variable
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyToken; // Simpan data user yang terverifikasi ke objek request
    next();
  } catch (err) {
    // Tangani berbagai jenis error token
    let message = "Invalid token";
    if (err.name === "TokenExpiredError") message = "Token expired";
    if (err.name === "JsonWebTokenError") message = "Token malformed";
    res.status(401).json({ message: `Unauthorized: ${message}` });
  }
};