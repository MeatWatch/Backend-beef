import express from "express";
import { uploadBeefPicture } from "../middleware/classificationMiddleware.js";
import { addClassification, getAllClassfyByUserId, getAllClassification } from "../controllers/classificationController.js";
import { authMiddleware } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/", getAllClassification);
router.get("/history", authMiddleware, getAllClassfyByUserId);
router.post("/", authMiddleware, uploadBeefPicture.single('image_beef'), addClassification);

export default router;
