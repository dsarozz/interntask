import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userCreationAttributes, userModel } from '../model/userModel';

function isExist(username) {
    return userModel.count({
        where: {
            username: username
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    });
}

export class userController {
    public getUser(req: Request, res: Response) {
        let username = req.params.username, id = req.params.id, whereClause;
        if (username != null) {
            whereClause = {
                username: username
            }
        } else if (username == null && id != null) {
            whereClause = {
                userid: id
            }
        }
        else {
            whereClause = {}
        }
        userModel.findAll({
            where: whereClause
        }).then(users => res.json(users));
    }

    public addUser(req: Request, res: Response) {
        const params: userCreationAttributes = req.body;
        userModel.create(params).then(result => {
            res.send('Success');
        }).catch(error => {
            res.send('Failed with error:' + error);
        })
    }

    public updateUser(req: Request, res: Response) {
        let username = req.params.username,
            newUsername = req.body.username,
            date = new Date();
        isExist(username).then(exists => {
            if (exists === true) {
                userModel.update({
                    username: newUsername,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    datemodified: date,
                },
                    {
                        where: {
                            username: username
                        }
                    }).then(result => {
                        res.send('Update successful')
                    }).catch(error => {
                        res.send('Update failed due to error :' + error);
                    });
            } else {
                res.send('Record not found!');
            }
        })
    }

    public deleteUser(req: Request, res: Response) {
        let username = req.params.username;
        let date = new Date();
        isExist(username).then(exists => {
            if (exists === true) {
                userModel.update({
                    datedeleted: date,
                },
                    {
                        where: {
                            username: username
                        }
                    }).then(result => {
                        res.send('User deleted successfully.');
                    }).catch(error => {
                        res.send('Update failed due to error :' + error);
                    });
            } else {
                res.send('Record not found!');
            }
        })
    }

    public userLogin(req: Request, res: Response) {
        let username = req.body.username,
            password = req.body.password
        userModel.findOne({
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
                        console.log(err)
                    } else {
                        if (user.username == username && tof == true) {
                            var date = new Date(),
                                authKey = uuidv4();
                            date.setHours(date.getHours() + 6);
                            userModel.update({
                                authkey: authKey,
                                authkeyexpire: date
                            },
                                {
                                    where: {
                                        username: user.username
                                    }
                                }).then(response => {
                                    if (response != null) {
                                        res.setHeader('authKey', authKey);
                                        res.setHeader('UID', user.userid);
                                        res.send('Login successful for user: ' + user.username);
                                    } else {
                                        res.send('Failed to create authorization key');
                                    }
                                })
                        } else {
                            res.send('Login failed.')
                        }
                    }
                });
            }
        })
    }

    public userLogout(req: Request, res: Response) {
        res.setHeader('authKey', null);
        res.setHeader('UID', null);
        res.send('Logged Out!');
    }
}    
