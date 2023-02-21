"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = exports.auth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const Model_1 = require("../Model");
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "Kindly login"
            });
        }
        //Bearer token
        const token = authorization.slice(7, authorization.length);
        let verified = (0, jsonwebtoken_1.verify)(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorized access"
            });
        }
        const { id } = verified;
        // find user by Id
        const user = await Model_1.UserInstance.findOne({
            where: { id: id }
        });
        if (!user) {
            return res.status(401).json({
                Error: "Unauthorized access"
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Unauthorized" });
    }
};
exports.auth = auth;
const authAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "Kindly login"
            });
        }
        //Bearer token
        const token = authorization.slice(7, authorization.length);
        let verified = (0, jsonwebtoken_1.verify)(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorized access"
            });
        }
        const { id } = verified;
        // find user by Id
        const user = await Model_1.AdminInstance.findOne({
            where: { id: id }
        });
        if (!user) {
            return res.status(401).json({
                Error: "Unauthorized access"
            });
        }
        req.admin = verified;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Unauthorized" });
    }
};
exports.authAdmin = authAdmin;
