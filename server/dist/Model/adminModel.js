"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInstance = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
const postModel_1 = require("./postModel");
class AdminInstance extends sequelize_1.Model {
}
exports.AdminInstance = AdminInstance;
AdminInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    postId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please input phone number",
            },
        },
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address is required",
            },
            isEmail: {
                msg: "Please provide a valid email",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please input password",
            },
        },
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "otp required",
            },
        },
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp expired"
            },
            notEmpty: {
                msg: "provide an Otp"
            },
        }
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "user must be verified"
            },
            notEmpty: {
                msg: "User not verified"
            }
        }
    },
}, {
    sequelize: config_1.db,
    tableName: "admin"
});
AdminInstance.hasMany(postModel_1.PostInstance, { foreignKey: 'adminId', as: 'post' });
postModel_1.PostInstance.belongsTo(AdminInstance, { foreignKey: 'adminId', as: 'admin' });
