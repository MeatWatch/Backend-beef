import express from "express";
import { uploadBeefPicture } from "../middleware/classificationMiddleware.js";
import { addClassification, getAllClassfyByUserId, getAllClassification } from "../controllers/classificationController.js";
import { authMiddleware } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllClassification);
router.get("/history", authMiddleware, getAllClassfyByUserId);
router.post("/", authMiddleware, uploadBeefPicture, addClassification);

export default router;
