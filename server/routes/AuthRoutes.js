import {Router} from 'express'
import { login, signup,getInfo,updateProfile,addProfileImage,removeProfileImage, logout} from '../controllers/AuthController.js';
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import { storage } from "../CloudinaryConfig.js";
import multer from 'multer';
const upload = multer({ storage: storage })
const authRoutes=Router();
authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.get("/user-info",verifyToken,getInfo);
authRoutes.post("/update-profile",verifyToken,updateProfile);
authRoutes.post("/add-profile-image", upload.single("profile-image"),verifyToken, addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
authRoutes.post("/logout",logout)
export default authRoutes;