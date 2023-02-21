"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.resetPasswordPost = exports.resetPasswordGet = exports.forgotPassword = exports.UpdateUserProfile = exports.getAllUsers = exports.Login = exports.resendOTP = exports.verifyUser = exports.Register = void 0;
const userModel_1 = require("../Model/userModel");
const validation_1 = require("../utils/validation");
const uuid_1 = require("uuid");
const notification_1 = require("../utils/notification");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const bcryptjs_1 = require("bcryptjs");
const Model_1 = require("../Model");
//Registry
const Register = async (req, res) => {
    try {
        const { interest, email, phone, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = validation_1.registerSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //Generate Salt
        const salt = await (0, validation_1.GenerateSalt)();
        const userPassword = await (0, validation_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //check if user exist
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create User
        if (!User) {
            let user = await userModel_1.UserInstance.create({
                id: uuiduser,
                userName: "",
                phone,
                email,
                password: userPassword,
                salt: salt,
                address: "",
                otp,
                otp_expiry: expiry,
                interest,
                verified: false,
                image: "",
                role: 'user'
            });
            //Send OTP to user
            // await onRequestOTP(otp,phone);
            // //Send Email 
            const html = (0, notification_1.emailHtml)(otp);
            await (0, notification_1.mailSent2)(config_1.FromAdminMail, email, config_1.userSubject, html);
            //check if user exists(where you give the user identity)
            const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
            //Generate Signature for user
            let signature = await (0, validation_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified
            });
            console.log(signature);
            return res.status(201).json({
                message: 'User created successfully check email or phone for OTP verification',
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            Error: 'User already exists'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
/** =============== Verify Users =============== **/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, validation_1.verifySignature)(token);
        console.log(decode);
        //check if user exists(where you give the user identity)
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = await userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } });
                console.log(updatedUser);
                //Regenerate a new signature
                let signature = await (0, validation_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified
                });
                if (updatedUser) {
                    const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                    return res.status(200).json({
                        message: 'You have successfully verified your account',
                        signature,
                        verified: User.verified
                    });
                }
            }
        }
        return res.status(400).json({
            Error: 'OTP is invalid or expired'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify-user"
        });
    }
};
exports.verifyUser = verifyUser;
/** =============== Resend OTP =============== **/
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, validation_1.verifySignature)(token);
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            //Generate OTP
            const { otp, expiry } = (0, notification_1.GenerateOTP)();
            console.log({ otp, expiry });
            const updatedUser = await userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry
            }, { where: { email: decode.email } });
            if (updatedUser) {
                const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                //Send OTP to user
                // await onRequestOTP(otp,User.phone);
                //Send Email 
                const html = (0, notification_1.emailHtml)(otp);
                await (0, notification_1.mailSent2)(config_1.FromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend to registered phone number and email"
                });
            }
        }
        return res.status(400).json({
            Error: 'Error sending OTP'
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature"
        });
    }
};
exports.resendOTP = resendOTP;
//Login
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate login
        const validateResult = validation_1.loginSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        console.log(validateResult);
        //check if the user exist
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        console.log(User);
        if (User.verified === true) {
            const validation = await (0, validation_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Generate signature for user
                let signature = await (0, validation_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                console.log(signature);
                return res.status(200).json({
                    message: "You have successfully login",
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
        }
        return res.status(400).json({
            Error: 'Wrong Username or Password or not a verified user'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login"
        });
    }
};
exports.Login = Login;
/** =============== PROFILE =============== **/
const getAllUsers = async (req, res) => {
    try {
        const limit = req.query.limit;
        const users = await userModel_1.UserInstance.findAndCountAll({
            limit: limit
        });
        return res.status(200).json({
            message: "You have successfully retrieved",
            Count: users.count,
            Users: users.rows
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-all-users"
        });
    }
};
exports.getAllUsers = getAllUsers;
//Update User Password
const UpdateUserProfile = async (req, res) => {
    try {
        const token = req.params.id;
        const { id } = await (0, validation_1.verifySignature)(token);
        const { userName, image, address, interest, phone, email } = req.body;
        //validate profile
        console.log("This is the token", token);
        const validateResult = validation_1.editProfileSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //find if user exist
        const User = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(400).json({
                Error: "You are not authorized to update user",
            });
        }
        const newUser = (await userModel_1.UserInstance.update({
            userName,
            image: req.file.path,
            address,
            interest,
            phone,
            email,
        }, { where: { id: id } }));
        if (newUser) {
            const User = (await userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "Profile updated successfully",
                User,
            });
        }
        return res.status(400).json({
            Error: "User does not exist",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "./users/update-profile/:id",
        });
    }
};
exports.UpdateUserProfile = UpdateUserProfile;
// ForgotPassword
const forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const { email } = req.body;
        // validate forgotpassword
        const validateResult = validation_1.forgotPasswordSchema.validate(req.body, validation_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const oldUser = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (oldUser) {
            const secret = config_1.APP_SECRET + oldUser.password;
            const token = (0, jsonwebtoken_1.sign)({ email: oldUser.email, id: oldUser.id }, secret, {
                expiresIn: "10m",
            });
            // creating link to send to the user
            const link = `${config_1.Base_Url}/users/resetpassword/${oldUser.id}`;
            if (token) {
                const html = (0, notification_1.emailHtml2)(link);
                await (0, notification_1.mailSent2)(config_1.FromAdminMail, oldUser.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "password reset link sent to email",
                    link,
                });
            }
            return res.status(400).json({
                Error: "Invalid credentials",
            });
        }
        return res.status(400).json({
            message: "email not found",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgotpasswordd",
        });
    }
};
exports.forgotPassword = forgotPassword;
// Reset Password
const resetPasswordGet = async (req, res) => {
    const { id, token } = req.params;
    //
    const oldUser = (await userModel_1.UserInstance.findOne({
        where: { id: id },
    }));
    if (!oldUser) {
        return res.status(400).json({
            message: "User Does Not Exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    try {
        const verifyPass = (0, jsonwebtoken_1.verify)(token, secret);
        return res.status(200).json({
            email: oldUser.email,
            verifyPass,
        });
    }
    catch (err) {
        console.log(err);
        res.send("Not Verified");
    }
};
exports.resetPasswordGet = resetPasswordGet;
const resetPasswordPost = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const oldUser = (await userModel_1.UserInstance.findOne({
        where: { id: id },
    }));
    const validateResult = validation_1.resetPasswordSchema.validate(req.body, validation_1.option);
    if (validateResult.error) {
        return res.status(400).json({
            Error: validateResult.error.details[0].message,
        });
    }
    if (!oldUser) {
        return res.status(400).json({
            message: "user does not exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    console.log("secret", secret);
    try {
        const encryptedPassword = await (0, bcryptjs_1.hash)(password, oldUser.salt);
        console.log("password", password);
        const updatedPassword = (await userModel_1.UserInstance.update({
            password: encryptedPassword,
        }, { where: { id: id } }));
        return res.status(200).json({
            message: "you have successfully changed your password",
            updatedPassword,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/reset-password/:id/:token",
        });
    }
};
exports.resetPasswordPost = resetPasswordPost;
const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;
        const post = await Model_1.PostInstance.findOne({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.likes.includes(userId)) {
            // If the user already liked the post, remove the like
            post.likes = post.likes.filter((id) => id !== userId);
        }
        else {
            // Otherwise, add the like
            post.likes.push(userId);
        }
        res.status(200).json({
            message: 'Post was updated successfully',
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            Error: "Internal server Error",
            route: "/users/:id/like"
        });
    }
};
exports.likePost = likePost;
