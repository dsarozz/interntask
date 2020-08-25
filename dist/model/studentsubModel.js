"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsubjectModel = void 0;
const sequelize_1 = require("sequelize");
const dbConnection_1 = require("../dbConnection");
exports.studentsubjectModel = dbConnection_1.connection.define('studentsubjects', {
    studentsubjectid: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectid: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'subjects',
            key: 'subjectid',
        }
    },
    studentid: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'students',
            key: 'studentid',
        }
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
//# sourceMappingURL=studentsubModel.js.map