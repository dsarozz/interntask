"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const sequelize_1 = require("sequelize");
const dbConfig = require("./config");
exports.connection = new sequelize_1.Sequelize(dbConfig.dbName, dbConfig.userName, dbConfig.password, {
    dialect: 'postgres',
});
//# sourceMappingURL=dbConnection.js.map