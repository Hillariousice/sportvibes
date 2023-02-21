import express from 'express'
import { UpdateUserProfile,Login,forgotPassword,resetPasswordGet,resetPasswordPost, Register,likePost, verifyUser, resendOTP, getAllUsers } from '../Controller/userController';
import { auth } from '../middleware/auth';
import { upload } from '../utils/multer';




const router = express.Router()


router.post("/signup", Register);
router.patch("/update-profile/:id", auth,upload.single('image'), UpdateUserProfile);
router.post("/verify-user/:signature",verifyUser)
router.post("/login", Login);
router.get('/resend-otp/:signature',resendOTP)
router.get('/get-all-users',getAllUsers)

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:token", resetPasswordGet);
router.post("/resetpassword/:id",resetPasswordPost);
router.get('/:id/like',likePost)


export default router