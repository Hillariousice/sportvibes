import express from 'express'
import { AdminRegister, createPost, deletePost, superAdmin,updatePost,getAdminPosts, getFeedPosts } from '../Controller/adminController';
import { Login, resetPasswordPost } from '../Controller/userController';

import { authAdmin } from '../middleware/auth';
import { upload } from '../utils/multer';




const router = express.Router()


router.post("/create-admin", AdminRegister);
router.post("/create-superadmin",upload.single('image'), superAdmin);

router.patch("/create-post", authAdmin,upload.single('image') ,createPost);

router.post("/delete-post/:postid", authAdmin, deletePost);
router.get("/update-post/:postid", authAdmin, updatePost);
router.post("/:postId/posts", authAdmin, getAdminPosts);
router.post("/posts", authAdmin, getFeedPosts);



export default router