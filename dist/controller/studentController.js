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
function listColumns() {
    return studentModel_1.studentModel.findAll().then(columns => {
        var allColumns = Object.keys(columns);
        return allColumns;
    });
}
class studentController {
    getAllStudents(req, res) {
        studentModel_1.studentModel.findAll({
            where: {
                datedeleted: null,
            }
        }).then(students => res.json(students));
    }
    getStudents(req, res) {
        let page = req.params.page, pageSize = req.params.pageSize, orderBy = req.params.orderBy, order = req.params.order, orderClause, columns = Object.keys(studentModel_1.studentModel.rawAttributes);
        if (columns.includes(orderBy) === true) {
            orderClause = [orderBy, order];
        }
        else {
            orderClause = ['studentid', 'ASC'];
        }
        studentModel_1.studentModel.findAll({
            // where: {
            //     datedeleted: null,
            // },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [
                orderClause
            ]
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
                    email: req.body.email,
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