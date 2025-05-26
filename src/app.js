import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import classificationRoutes from "./routes/classificationRoutes.js";

dotenv.config();

const app = express();

//  Midleware CORS
app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/classifications", classificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
