"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const config_1 = require("./config");
require('dotenv').config();
//Sequelize connection
config_1.db.sync().then(() => {
    console.log('DB connected successfully');
}).catch(err => {
    console.log(err);
});
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use('/users', userRoutes_1.default);
app.use('/admins', adminRoutes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
