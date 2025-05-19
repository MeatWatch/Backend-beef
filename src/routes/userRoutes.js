import express from "express";
import { getAllUsers, createNewUser, updateUserWithId } from "../controllers/userController.js";
import { uploadProfilePicture } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createNewUser);
router.patch("/:id", uploadProfilePicture.single('profile_picture'), updateUserWithId);

export default router;
