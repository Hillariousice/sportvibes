"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminPosts = exports.getFeedPosts = exports.updatePost = exports.deletePost = exports.createPost = exports.superAdmin = exports.AdminRegister = void 0;
const validation_1 = require("../utils/validation");
const notification_1 = require("../utils/notification");
const Model_1 = require("../Model");
const uuid_1 = require("uuid");
/*=======Admin Register=========*/
const AdminRegister = async (req, res) => {
    try {
        const id = req.admin.id;
        const { email, phone, password, userName, address, image } = req.body;
        const uuidadmin = (0, uuid_1.v4)();
        const validateResult = validation_1.adminSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        console.log(validateResult);
        //Generate Salt
        const salt = await (0, validation_1.GenerateSalt)();
        const adminPassword = await (0, validation_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //check if admin exist
        const Admin = await Model_1.AdminInstance.findOne({ where: { id: id } });
        if (Admin.email === email) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: 'Phone number already exists'
            });
        }
        //Create Admin
        if (Admin.role === "superadmin") {
            await Model_1.AdminInstance.create({
                id: uuidadmin,
                email,
                password: adminPassword,
                userName,
                salt,
                address,
                postId: "",
                phone,
                otp,
                otp_expiry: expiry,
                image: "",
                verified: true,
                role: "admin"
            });
            //check if admin exists(where you give the admin identity)
            const Admin = await Model_1.AdminInstance.findOne({ where: { id: id } });
            //Generate Signature for user
            let signature = await (0, validation_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            });
            return res.status(201).json({
                message: 'Admin created successfully',
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: 'Admin already exists'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin"
        });
    }
};
exports.AdminRegister = AdminRegister;
/** =============== Super Admin =============== **/
const superAdmin = async (req, res) => {
    try {
        const { email, phone, password, userName, address, image } = req.body;
        const uuidadmin = (0, uuid_1.v4)();
        const validateResult = validation_1.adminSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //Generate Salt
        const salt = await (0, validation_1.GenerateSalt)();
        const adminPassword = await (0, validation_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //check if admin exist
        const Admin = await Model_1.AdminInstance.findOne({ where: { email: email } });
        //Create Admin
        if (!Admin) {
            await Model_1.AdminInstance.create({
                id: uuidadmin,
                email,
                password: adminPassword,
                userName,
                salt,
                address,
                postId: "",
                phone,
                otp,
                otp_expiry: expiry,
                image: "",
                verified: true,
                role: "superadmin"
            });
            //check if admin exists(where you give the admin identity)
            const Admin = await Model_1.AdminInstance.findOne({ where: { email: email } });
            //Generate Signature for user
            let signature = await (0, validation_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            });
            return res.status(201).json({
                message: 'Admin created successfully',
                signature,
                verified: Admin.verified
            });
        }
        return res.status(400).json({
            message: 'Admin already exists'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-super-admin"
        });
    }
};
exports.superAdmin = superAdmin;
/** ============== Create Post ============== **/
const createPost = async (req, res) => {
    try {
        const id = req.admin.id;
        const { club, content, category, editor, description, image } = req.body;
        const uuidpost = (0, uuid_1.v4)();
        //check if admin exist
        const Post = await Model_1.PostInstance.findOne({ where: { category: category } });
        const Admin = await Model_1.AdminInstance.findOne({ where: { id: id } });
        if (Admin.role === 'admin' || Admin.role === 'superadmin') {
            //Create Admin
            if (!Post) {
                const createPost = await Model_1.PostInstance.create({
                    id: uuidpost,
                    editor,
                    club,
                    description,
                    userId: "",
                    content,
                    adminId: "",
                    category,
                    likes: [],
                    comments: [],
                    image: req.file.path
                });
                return res.status(201).json({
                    message: 'Post created successfully',
                    createPost
                });
            }
            return res.status(400).json({
                message: 'Post already exists'
            });
        }
        return res.status(400).json({
            message: 'Unauthorized'
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-post"
        });
    }
};
exports.createPost = createPost;
/** ==============  Admin  Delete Post ============== **/
const deletePost = async (req, res) => {
    try {
        const id = req.admin.id;
        const postid = req.params.postid;
        const Admin = await Model_1.AdminInstance.findOne({ where: { id: id } });
        if (Admin) {
            const deletedPost = await Model_1.PostInstance.destroy({ where: { id: postid } });
            return res.status(201).json({
                message: 'Post deleted successfully',
                deletedPost
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/delete-post/postid"
        });
    }
};
exports.deletePost = deletePost;
/** ==============  Admin Update Post ============== **/
const updatePost = async (req, res) => {
    try {
        const id = req.admin.id;
        const postid = req.params.postid;
        const { club, content, category, editor, description, image } = req.body;
        const Admin = await Model_1.AdminInstance.findOne({ where: { id: id } });
        if (Admin) {
            const Post = await Model_1.PostInstance.findOne({ where: { id: postid } });
            if (Post) {
                const updatePost = await Model_1.PostInstance.update({ club, content, category, editor, description, image: req.file.path
                }, { where: { id: postid } });
                return res.status(201).json({
                    message: 'Post update successfully.',
                    updatePost
                });
            }
            return res.status(400).json({
                message: 'Post not found.'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/update-post/:postid"
        });
    }
};
exports.updatePost = updatePost;
const getFeedPosts = async (req, res) => {
    try {
        const post = await Model_1.PostInstance.findAll();
        res.status(200).json({
            message: "Feeds was retrieved successfully",
            post
        });
    }
    catch (err) {
        res.status(404).json({
            Error: "Internal server Error",
            route: "/admins/post"
        });
    }
};
exports.getFeedPosts = getFeedPosts;
const getAdminPosts = async (req, res) => {
    try {
        const { postId } = req.params;
        const Admin = await Model_1.AdminInstance.findAll({ where: { id: postId } });
        res.status(200).json({
            message: "Feeds was retrieved successfully",
            Admin
        });
    }
    catch (err) {
        res.status(404).json({
            Error: "Internal server Error",
            route: "/admins/:postId/posts"
        });
    }
};
exports.getAdminPosts = getAdminPosts;
