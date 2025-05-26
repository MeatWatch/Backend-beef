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
  getMe,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/login", loginUser);
router.post("/register", registerUser);
// router.get("/me", authMiddleware, getMe); // --> ini yang dibutuhkan FE

// Patch dengan auth dan upload middleware
router.patch(
  "/:id",
  authMiddleware, // tambahkan authmiddleware
  uploadProfilePicture.single("profile_picture"),
  updateUserWithId
);

export default router;
