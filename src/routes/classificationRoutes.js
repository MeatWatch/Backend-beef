import express from "express";
import { uploadBeefPicture } from "../middleware/classificationMiddleware.js";
import { addClassification, getAllClassfyByIdUser, getAllClassification } from "../controllers/classificationController.js";
import { authMiddleware } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllClassification);
router.get("/history", authMiddleware, getAllClassfyByIdUser);
router.post("/", authMiddleware, uploadBeefPicture.single('image_beef'), addClassification);

export default router;
