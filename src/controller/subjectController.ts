import { Request, Response } from 'express';
import { subjectModel, subjectCreationAttributes, subjectAttributes, subjectInstance } from '../model/subjectModel'

function isExist(subjectid) {
    return subjectModel.count({
        where: {
            subjectid: subjectid
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    });
}


export class subjectController {
    public getSubjects(req: Request, res: Response) {
        subjectModel.findAll({
            where: {
                datedeleted: null,
            },
            attributes: {
                include: ['subjectid'],
            }
        }).then(subjects => res.json(subjects));
    }

    public addSubject(req: Request, res: Response) {
        let subjectName = req.body.subjectname;
        const params: subjectCreationAttributes = req.body;
        subjectModel.create(params).then(result => {
            res.send('Successfully added subject ' + subjectName);
        }).catch(error => {
            res.send('Failed to add due to error :' + error);
        })
    }

    public udpateSubject(req: Request, res: Response) {
        let subjectid = req.params.id;
        let date = new Date();
        isExist(subjectid).then(exists => {
            if (exists === true) {
                subjectModel.update({
                    subjectname: req.body.subjectname,
                    datemodified: date,
                },
                    {
                        where: {
                            subjectid: subjectid
                        }
                    }).then(result => {
                        res.send('Update successful for ID :' + subjectid);
                    }).catch(error => {
                        res.send('Update failed due to error :' + error);
                    });
            } else {
                res.send('Record not found!');
            }
        })
    }

    public deleteSubject(req: Request, res: Response) {
        let subjectid = req.params.id;
        let date = new Date();
        isExist(subjectid).then(exists => {
            if (exists === true) {
                subjectModel.update({
                    datedeleted: date,
                },
                    {
                        where: {
                            subjectid: subjectid
                        }
                    }).then(result => {
                        res.send('Delete successful for ID :' + subjectid + 'on :' + date);
                    }).catch(error => {
                        res.send('Delete failed due to error :' + error);
                    });
            } else {

                res.send('Record not found!');
            }
        })

    }
}    
