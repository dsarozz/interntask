"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentModel = void 0;
const sequelize_1 = require("sequelize");
const dbConnection_1 = require("../dbConnection");
exports.studentModel = dbConnection_1.connection.define('students', {
    studentid: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentname: {
        type: sequelize_1.DataTypes.STRING,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
    },
    datemodified: {
        type: sequelize_1.DataTypes.DATE,
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    }
}, {
    freezeTableName: true,
    timestamps: false
});
//# sourceMappingURL=studentModel.js.map