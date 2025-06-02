import express from "express";
import {
  authMiddleware,
  uploadProfilePicture,
} from "../middleware/userMiddleware.js";
import {
  getAllUsers,
  getProfilById,
  updateUserWithUserId,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/profile", authMiddleware, getProfilById);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.patch(
  "/profile",
  authMiddleware,
  uploadProfilePicture,
  updateUserWithUserId
);

export default router;