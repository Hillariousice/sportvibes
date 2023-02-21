"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchema = exports.option = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.loginSchema = exports.editProfileSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config");
dotenv_1.default.config();
exports.registerSchema = joi_1.default.object().keys({
    interest: joi_1.default.string(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[a-z0-9]{3,30}$/),
    phone: joi_1.default.string(),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
});
exports.editProfileSchema = joi_1.default.object().keys({
    userName: joi_1.default.string(),
    phone: joi_1.default.string(),
    fullName: joi_1.default.string(),
    address: joi_1.default.string(),
    email: joi_1.default.string(),
    image: joi_1.default.string()
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[A-Za-z0-9]{3,30}$')),
});
const GenerateSalt = async () => {
    return await (0, bcryptjs_1.genSalt)();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await (0, bcryptjs_1.hash)(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = async (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, config_1.APP_SECRET, { expiresIn: "1d" });
};
exports.GenerateSignature = GenerateSignature;
//GENERATE TOKEN FOR A USER
const verifySignature = async (signature) => {
    return (0, jsonwebtoken_1.verify)(signature, config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
};
exports.validatePassword = validatePassword;
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required()
});
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password')
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
/**================Admin ===============**/
exports.adminSchema = joi_1.default.object().keys({
    phone: joi_1.default.string().required(),
    image: joi_1.default.string(),
    userName: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[A-Za-z0-9]{3,30}$')),
    address: joi_1.default.string(),
    email: joi_1.default.string().required()
});
