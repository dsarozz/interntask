"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentController = void 0;
const studentModel_1 = require("../model/studentModel");
function isExist(studentid) {
    return studentModel_1.studentModel.count({
        where: {
            studentid: studentid
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
class studentController {
    getStudents(req, res) {
        studentModel_1.studentModel.findAll({
            where: {
                datedeleted: null,
            },
            attributes: {
                include: ['studentid'],
            }
        }).then(students => res.json(students));
    }
    addStudent(req, res) {
        let studentName = req.body.studentname;
        const params = req.body;
        studentModel_1.studentModel.create(params).then(result => {
            res.send('Successfully added student ' + studentName);
        }).catch(error => {
            res.send('Failed to add due to error :' + error);
        });
    }
    udpateStudent(req, res) {
        let studentid = req.params.id;
        let date = new Date();
        isExist(studentid).then(exists => {
            if (exists === true) {
                studentModel_1.studentModel.update({
                    studentname: req.body.studentname,
                    address: req.body.address,
                    datemodified: date,
                }, {
                    where: {
                        studentid: studentid
                    }
                }).then(result => {
                    res.send('Update successful for ID :' + studentid);
                }).catch(error => {
                    res.send('Update failed due to error :' + error);
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
    deleteStudent(req, res) {
        let studentid = req.params.id;
        let date = new Date();
        isExist(studentid).then(exists => {
            if (exists === true) {
                studentModel_1.studentModel.update({
                    datedeleted: date,
                }, {
                    where: {
                        studentid: studentid
                    }
                }).then(result => {
                    res.send('Delete successful for ID :' + studentid + 'on :' + date);
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
exports.studentController = studentController;
//# sourceMappingURL=studentController.js.map