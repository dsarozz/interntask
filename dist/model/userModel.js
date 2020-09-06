"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const bcrypt = require("bcrypt");
const sequelize_1 = require("sequelize");
const dbConnection_1 = require("../dbConnection");
const saltRounds = 8;
exports.userModel = dbConnection_1.connection.define('users', {
    userid: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    authkey: {
        type: sequelize_1.DataTypes.UUID
    },
    authkeyexpire: {
        type: sequelize_1.DataTypes.DATE
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE
    },
    datemodified: {
        type: sequelize_1.DataTypes.DATE
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
});
exports.userModel.beforeCreate(function (user, options) {
    return bcrypt.hash(user.password, saltRounds).then(hashedPassword => {
        user.password = hashedPassword;
    });
});
//# sourceMappingURL=userModel.js.map