import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import classificationRoutes from "./routes/classificationRoutes.js";
import { reminderJob } from "./middleware/reminderMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Jalankan cron job (reminder)
try {
  reminderJob.start();
  console.log("🕒 Reminder job started");
} catch (err) {
  console.error("❌ Failed to start reminder job:", err.message);
}

// Route root (GET /)
app.get("/", (req, res) => {
  res.send("🚀 MeatWatch Backend is Running!");
});

// Static file (jika diperlukan di frontend)
app.use(
  "/images/users",
  express.static(path.join(__dirname, "../images/users"))
);
app.use(
  "/images/classification",
  express.static(path.join(__dirname, "../images/classification"))
);

// API routes
app.use("/users", userRoutes);
app.use("/classifications", classificationRoutes);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
