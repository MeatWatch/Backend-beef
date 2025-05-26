import express from "express";
import { uploadProfilePicture } from "../middleware/userMiddleware.js";
import { 
    getAllUsers, 
    createNewUser, 
    updateUserWithId, 
    loginUser,
    registerUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.patch("/:id", uploadProfilePicture.single('profile_picture'), updateUserWithId);

export default router;
