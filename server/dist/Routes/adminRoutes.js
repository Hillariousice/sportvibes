"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../Controller/adminController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post("/create-admin", adminController_1.AdminRegister);
router.post("/create-superadmin", multer_1.upload.single('image'), adminController_1.superAdmin);
router.patch("/create-post", auth_1.authAdmin, multer_1.upload.single('image'), adminController_1.createPost);
router.post("/delete-post/:postid", auth_1.authAdmin, adminController_1.deletePost);
router.get("/update-post/:postid", auth_1.authAdmin, adminController_1.updatePost);
router.post("/:postId/posts", auth_1.authAdmin, adminController_1.getAdminPosts);
router.post("/posts", auth_1.authAdmin, adminController_1.getFeedPosts);
exports.default = router;
