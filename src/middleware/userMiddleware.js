import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// inisialisasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users/"); // Tempat penyimpanan image profile user
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

// peizinan (hanya izinkan image)
const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// inisialisasi middleware multer
export const uploadProfilePicture = multer({
  storage: storage,
  fileFilter: filter,
});

// cek token
export const authMiddleware = (req, res, next) => {
  if (req.path === "/login" || req.path === "/register") return next();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided or invalid format",
    });
  }

  const token = authHeader.split(" ")[1].trim();
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyToken;
    next();
  } catch (err) {
    let message = "Invalid token";
    if (err.name === "TokenExpiredError") message = "Token expired";
    if (err.name === "JsonWebTokenError") message = "Token malformed";
    res.status(401).json({ message: `Unauthorized: ${message}` });
  }
};