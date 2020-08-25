"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsubjectController = void 0;
const studentModel_1 = require("../model/studentModel");
const subjectModel_1 = require("../model/subjectModel");
const studentsubModel_1 = require("../model/studentsubModel");
function checkSubject(subjectid) {
    return subjectModel_1.subjectModel.count({
        where: {
            subjectid: subjectid
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
function checkStudent(studentid) {
    return studentModel_1.studentModel.count({
        where: {
            studentid: studentid,
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
function checkStudentSubject(studentid, subjectid) {
    return studentsubModel_1.studentsubjectModel.count({
        where: {
            studentid: studentid,
            subjectid: subjectid,
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
function isExist(studentsubjectid) {
    return studentsubModel_1.studentsubjectModel.count({
        where: {
            studentsubjectid: studentsubjectid
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
class studentsubjectController {
    getStudentSubjects(req, res) {
        studentsubModel_1.studentsubjectModel.findAll({
            where: {
                datedeleted: null,
            },
            attributes: {
                include: ['studentsubjectid'],
            }
        }).then(studentsubjects => res.json(studentsubjects));
    }
    addStudentSubject(req, res) {
        let subjectid = req.body.subjectid, studentid = req.body.studentid;
        const params = req.body;
        checkStudentSubject(studentid, subjectid).then(exists => {
            if (exists == false) {
                studentsubModel_1.studentsubjectModel.create(params).then(result => {
                    res.send('Successfully added student id: ' + studentid + ' to subject id: ' + subjectid);
                }).catch(error => {
                    res.send('Failed to add due to error :' + error);
                });
            }
            else {
                res.send('Student id: ' + studentid + ' is already associated with subject id: ' + subjectid);
            }
        });
    }
    udpateStudentSubject(req, res) {
        let studentsubjectid = req.params.id, subjectid = req.body.subjectid, studentid = req.body.studentid, date = new Date();
        isExist(studentsubjectid).then(exists => {
            if (exists === true) {
                checkStudentSubject(studentid, subjectid).then(result => {
                    if (result == false) {
                        studentsubModel_1.studentsubjectModel.update({
                            studentid: studentid,
                            subjectid: subjectid,
                            datemodified: date,
                        }, {
                            where: {
                                studentsubjectid: studentsubjectid,
                            }
                        }).then(result => {
                            res.send('Update successful for student ID :' + studentid + ' & subject ID: ' + subjectid);
                        }).catch(error => {
                            res.send('Update failed due to error :' + error);
                        });
                    }
                    else {
                        res.send('Student id: ' + studentid + ' is already associated with subject id: ' + subjectid);
                    }
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
    deleteStudentSubject(req, res) {
        let studentsubjectid = req.params.id, date = new Date();
        isExist(studentsubjectid).then(exists => {
            if (exists === true) {
                studentsubModel_1.studentsubjectModel.update({
                    datedeleted: date,
                }, {
                    where: {
                        studentsubjectid: studentsubjectid,
                    }
                }).then(result => {
                    res.send('Delete successful for student subject ID: ' + studentsubjectid);
                }).catch(error => {
                    res.send('Delete failed due to error :' + error);
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
}
exports.studentsubjectController = studentsubjectController;
//# sourceMappingURL=studentsubController.js.map