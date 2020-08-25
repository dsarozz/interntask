"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectModel = void 0;
const sequelize_1 = require("sequelize");
const dbConnection_1 = require("../dbConnection");
exports.subjectModel = dbConnection_1.connection.define('subjects', {
    subjectid: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectname: {
        type: sequelize_1.DataTypes.STRING,
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
    },
    datemodified: {
        type: sequelize_1.DataTypes.DATE,
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    freezeTableName: true,
    timestamps: false
});
//# sourceMappingURL=subjectModel.js.map