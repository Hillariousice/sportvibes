"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostInstance = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
class PostInstance extends sequelize_1.Model {
}
exports.PostInstance = PostInstance;
PostInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    editor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    club: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    likes: {
        type: (0, sequelize_1.ARRAY)(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    adminId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    comments: {
        type: (0, sequelize_1.ARRAY)(sequelize_1.DataTypes.BOOLEAN),
        allowNull: true,
        defaultValue: [],
    },
}, {
    sequelize: config_1.db,
    tableName: "sport",
});
