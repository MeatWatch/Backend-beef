import express from "express";
import {
  authMiddleware,
  uploadProfilePicture,
} from "../middleware/userMiddleware.js";
import {
  getAllUsers,
  createNewUser,
  updateUserWithId,
  loginUser,
  registerUser,
  getProfilById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/profil", authMiddleware, getProfilById);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.patch("/", authMiddleware, uploadProfilePicture.single("profile_picture"), updateUserWithId);

export default router;
