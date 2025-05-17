import express from "express";
import {
  getAllClassifications,
  createClassification,
} from "../controllers/classificationController.js";

const router = express.Router();

router.get("/", getAllClassifications);
router.post("/", createClassification);

export default router;
