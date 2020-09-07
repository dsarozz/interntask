"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationController = void 0;
const userModel_1 = require("../model/userModel");
class authenticationController {
    authentication(req, res, next) {
        var authKey = req.get('authKey');
        var UID = req.get('UID');
        var date = new Date();
        if (authKey != null) {
            userModel_1.userModel.findOne({
                where: {
                    userid: UID
                }
            }).then(user => {
                var authkeyexpire = new Date(user.authkeyexpire);
                if (authKey != user.authkey) {
                    res.status(400).send('You are not authorized.');
                }
                else {
                    if (authkeyexpire < date && authKey == user.authkey) {
                        res.setHeader('authKey', null);
                        res.setHeader('UID', null);
                        res.status(400).send('Your session has already expired. Please login again to continue!');
                    }
                    else {
                        next();
                    }
                }
            });
        }
        else {
            res.send('You have not logged in yet! Please login first!');
        }
    }
}
exports.authenticationController = authenticationController;
//# sourceMappingURL=authenticationController.js.map