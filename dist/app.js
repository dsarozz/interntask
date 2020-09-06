"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const router_1 = require("./route/router");
const authRouter_1 = require("./route/authRouter");
const authenticationController_1 = require("./controller/authenticationController");
class App {
    constructor() {
        this.router = new router_1.Routes();
        this.authRouter = new authRouter_1.AuthRoutes();
        this.authMiddleware = new authenticationController_1.authenticationController();
        this.app = express();
        this.config();
        this.router.routes(this.app);
        this.authRouter.authRoutes(this.app.use(this.authMiddleware.authentication));
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map