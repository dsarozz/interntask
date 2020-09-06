import { Request, Response } from 'express';
import { userModel } from '../model/userModel';

export class authenticationController {
    public authentication(req: Request, res: Response, next) {
        var authKey = req.get('authKey');
        var UID = req.get('UID');
        var date = new Date();
        if (authKey != null) {
            userModel.findOne({
                where: {
                    userid: UID
                }
            }).then(user => {
                var authkeyexpire = new Date(user.authkeyexpire)
                if (authKey != user.authkey) {
                    res.status(400).send('You are not authorized.')
                } else {
                    if (authkeyexpire < date) {
                        res.status(400).send('Your session has already expired. Please login again to continue!')
                    } else {
                        next();
                    }
                }
            })
        } else {
            res.send('You have not logged in yer! Please login first!')
        }
    }
}
