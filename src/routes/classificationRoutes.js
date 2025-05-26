import express from "express";
import {
  getAllClassification,
  addClassification,
  deleteClassificationById,
} from "../controllers/classificationController.js";
import { uploadBeefPicture } from "../middleware/classificationMiddleware.js";

const router = express.Router();

router.get("/:user_id", getAllClassification);
router.post("/:user_id", uploadBeefPicture.single('image_path'), addClassification);
router.delete("/:user_id", deleteClassificationById);

export default router;
