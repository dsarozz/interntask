"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const userController_1 = require("../controller/userController");
const resultsController_v2_1 = require("../controller/resultsController_v2");
class Routes {
    constructor() {
        this.UserController = new userController_1.userController();
        this.ResultsController = new resultsController_v2_1.resultsController();
    }
    routes(app) {
        app.route('/login').post(this.UserController.userLogin);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=router.js.map