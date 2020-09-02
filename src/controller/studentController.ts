import { Request, Response } from 'express';
import { studentCreationAttributes, studentModel } from '../model/studentModel';

function isExist(studentid) {
    return studentModel.count({
        where: {
            studentid: studentid
        }
    }).then(count => {
        if (count == 0) {
            return false;
        } else {
            return true;
        }
    });
}

export class studentController {

    public getStudents(req: Request, res: Response) {
        studentModel.findAll({
            where: {
                datedeleted: null,
            },
            attributes: {
                include: ['studentid'],
            }
        }).then(students => res.json(students));
    }

    public addStudent(req: Request, res: Response) {
        let studentName = req.body.studentname;
        const params: studentCreationAttributes = req.body;
        studentModel.create(params).then(result => {
            res.send('Successfully added student ' + studentName);
        }).catch(error => {
            res.send('Failed to add due to error :' + error);
        })
    }

    public udpateStudent(req: Request, res: Response) {
        let studentid = req.params.id;
        let date = new Date();
        isExist(studentid).then(exists => {
            if (exists === true) {
                studentModel.update({
                    studentname: req.body.studentname,
                    address: req.body.address,
                    datemodified: date,
                },
                    {
                        where: {
                            studentid: studentid
                        }
                    }).then(result => {
                        res.send('Update successful for ID :' + studentid);
                    }).catch(error => {
                        res.send('Update failed due to error :' + error);
                    });
            } else {
                res.send('Record not found!');
            }
        })
    }

    public deleteStudent(req: Request, res: Response) {
        let studentid = req.params.id;
        let date = new Date();
        isExist(studentid).then(exists => {
            if (exists === true) {
                studentModel.update({
                    datedeleted: date,
                },
                    {
                        where: {
                            studentid: studentid
                        }
                    }).then(result => {
                        res.send('Delete successful for ID :' + studentid + 'on :' + date);
                    }).catch(error => {
                        res.send('Delete failed due to error :' + error);
                    });
            } else {

                res.send('Record not found!');
            }
        })

    }
}    
