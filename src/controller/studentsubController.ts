import { Request, Response } from 'express';
import { studentModel } from '../model/studentModel';
import { studentsubjectCreationAttributes, studentsubjectModel } from '../model/studentsubModel';
import { subjectModel } from '../model/subjectModel';

function checkSubject(subjectid) {
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
function checkStudent(studentid) {
    return studentModel.count({
        where: {
            studentid: studentid,
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    })
}

function checkStudentSubject(studentid, subjectid) {
    return studentsubjectModel.count({
        where: {
            studentid: studentid,
            subjectid: subjectid,
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    })
}

function isExist(studentsubjectid) {
    return studentsubjectModel.count({
        where: {
            studentsubjectid: studentsubjectid
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    });
}


export class studentsubjectController {
    public getSubjectByStudent(req: Request, res: Response) {
        let studentid = req.params.studentid
        studentModel.findAll({
            include: [
                {
                    model: subjectModel,
                    as: 'subjects',
                    attributes: ['subjectid', 'subjectname'],
                    through: {
                        attributes: [],
                    }
                }
            ],
            where: {
                studentid: studentid
            },
            attributes: {
                exclude: ['address', 'datecreated', 'datemodified', 'datedeleted']
            }
        }).then(results => res.json(results))
    }

    public getStudentSubjects(req: Request, res: Response) {
        let studentid = req.params.studentid
        studentsubjectModel.findAll({
            where: {
                datedeleted: null,
                studentid: studentid
            },
        }).then(studentsubjects => res.json(studentsubjects));
    }

    public addStudentSubject(req: Request, res: Response) {
        let subjectid = req.body.subjectid,
            studentid = req.body.studentid;
        const params: studentsubjectCreationAttributes = req.body;
        checkStudentSubject(studentid, subjectid).then(exists => {
            if (exists == false) {
                studentsubjectModel.create(params).then(result => {
                    res.send('Successfully added student id: ' + studentid + ' to subject id: ' + subjectid);
                }).catch(error => {
                    res.send('Failed to add due to error :' + error);
                })
            } else {
                res.send('Student id: ' + studentid + ' is already associated with subject id: ' + subjectid);
            }
        })

    }

    public udpateStudentSubject(req: Request, res: Response) {
        let studentsubjectid = req.params.id,
            subjectid = req.body.subjectid,
            studentid = req.body.studentid,
            date = new Date();
        isExist(studentsubjectid).then(exists => {
            if (exists === true) {
                checkStudentSubject(studentid, subjectid).then(result => {
                    if (result == false) {
                        studentsubjectModel.update({
                            studentid: studentid,
                            subjectid: subjectid,
                            datemodified: date,
                        },
                            {
                                where: {
                                    studentsubjectid: studentsubjectid,
                                }
                            }).then(result => {
                                res.send('Update successful for student ID :' + studentid + ' & subject ID: ' + subjectid);
                            }).catch(error => {
                                res.send('Update failed due to error :' + error);
                            });
                    } else {
                        res.send('Student id: ' + studentid + ' is already associated with subject id: ' + subjectid);
                    }
                })
            } else {
                res.send('Record not found!');
            }
        })
    }

    public deleteStudentSubject(req: Request, res: Response) {
        let studentsubjectid = req.params.id,
            date = new Date();
        isExist(studentsubjectid).then(exists => {
            if (exists === true) {
                studentsubjectModel.update({
                    datedeleted: date,
                },
                    {
                        where: {
                            studentsubjectid: studentsubjectid,
                        }
                    }).then(result => {
                        res.send('Delete successful for student subject ID: ' + studentsubjectid);
                    }).catch(error => {
                        res.send('Delete failed due to error :' + error);
                    });
            } else {
                res.send('Record not found!');
            }
        })
    }


}    
