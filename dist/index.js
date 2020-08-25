"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config = require("./config");
const dbConnection_1 = require("./dbConnection");
app_1.default.listen(config.port, function () {
    console.log('Server is running in port :' + config.port);
});
try {
    dbConnection_1.connection.authenticate();
    console.log('Connection successful to :' + config.dbName);
}
catch (error) {
    console.log('Connection failed due to: ' + error);
}
//# sourceMappingURL=index.js.map