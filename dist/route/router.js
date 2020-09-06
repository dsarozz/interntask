"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const userController_1 = require("../controller/userController");
class Routes {
    constructor() {
        this.UserController = new userController_1.userController();
    }
    routes(app) {
        app.route('/login').post(this.UserController.userLogin);
        app.route('/logout').post(this.UserController.userLogout);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=router.js.map