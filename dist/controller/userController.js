"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const userModel_1 = require("../model/userModel");
function isExist(username) {
    return userModel_1.userModel.count({
        where: {
            username: username
        }
    }).then(count => {
        if (count == 0) {
            return false;
        }
        else {
            return true;
        }
    });
}
class userController {
    getUser(req, res) {
        let username = req.params.username, id = req.params.id, whereClause;
        if (username != null) {
            whereClause = {
                username: username
            };
        }
        else if (username == null && id != null) {
            whereClause = {
                userid: id
            };
        }
        else {
            whereClause = {};
        }
        userModel_1.userModel.findAll({
            where: whereClause
        }).then(users => res.json(users));
    }
    addUser(req, res) {
        const params = req.body;
        userModel_1.userModel.create(params).then(result => {
            res.send('Success');
        }).catch(error => {
            res.send('Failed with error:' + error);
        });
    }
    updateUser(req, res) {
        let username = req.params.username, newUsername = req.body.username, date = new Date();
        isExist(username).then(exists => {
            if (exists === true) {
                userModel_1.userModel.update({
                    username: newUsername,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    datemodified: date,
                }, {
                    where: {
                        username: username
                    }
                }).then(result => {
                    res.send('Update successful');
                }).catch(error => {
                    res.send('Update failed due to error :' + error);
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
    deleteUser(req, res) {
        let username = req.params.username;
        let date = new Date();
        isExist(username).then(exists => {
            if (exists === true) {
                userModel_1.userModel.update({
                    datedeleted: date,
                }, {
                    where: {
                        username: username
                    }
                }).then(result => {
                    res.send('User deleted successfully.');
                }).catch(error => {
                    res.send('Update failed due to error :' + error);
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
    userLogin(req, res) {
        let username = req.body.username, password = req.body.password;
        userModel_1.userModel.findOne({
            where: {
                username: username
            },
        }).then(user => {
            if (user === null) {
                res.send('Check detail/ No such user exists ' + user.username);
            }
            else {
                bcrypt.compare(req.body.password, user.password, function (err, tof) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (user.username == username && tof == true) {
                            var date = new Date(), authKey = uuid_1.v4();
                            date.setHours(date.getHours() + 6);
                            userModel_1.userModel.update({
                                authkey: authKey,
                                authkeyexpire: date
                            }, {
                                where: {
                                    username: user.username
                                }
                            }).then(response => {
                                if (response != null) {
                                    res.setHeader('authKey', authKey);
                                    res.setHeader('UID', user.userid);
                                    res.send('Login successful for user: ' + user.username);
                                }
                                else {
                                    res.send('Failed to create authorization key');
                                }
                            });
                        }
                        else {
                            res.send('Login failed.');
                        }
                    }
                });
            }
        });
    }
    userLogout(req, res) {
        res.setHeader('authKey', null);
        res.send('Logged Out!');
    }
}
exports.userController = userController;
//# sourceMappingURL=userController.js.map