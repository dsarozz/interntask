"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsubjectController = void 0;
const studentModel_1 = require("../model/studentModel");
const studentsubModel_1 = require("../model/studentsubModel");
const subjectModel_1 = require("../model/subjectModel");
const sequelize = require("sequelize");
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
    getSubjectByStudent(req, res) {
        let studentid = req.params.studentid;
        studentModel_1.studentModel.findAll({
            include: [
                {
                    model: subjectModel_1.subjectModel,
                    as: 'subjects',
                    attributes: ['subjectid', 'subjectname'],
                    through: {
                        attributes: ['marks'],
                    }
                }
            ],
            where: {
                studentid: studentid
            },
            attributes: {
                exclude: ['address', 'datecreated', 'datemodified', 'datedeleted']
            }
        }).then(results => res.json(results));
    }
    getStudentSubjects(req, res) {
        let studentid = req.params.studentid;
        studentsubModel_1.studentsubjectModel.findAll({
            where: {
                datedeleted: null,
                studentid: studentid
            },
        }).then(studentsubjects => res.json(studentsubjects));
    }
    getStudentResults(req, res) {
        let studentid = req.params.studentid;
        studentModel_1.studentModel.findAll({
            attributes: ['studentname'],
            include: [
                {
                    model: subjectModel_1.subjectModel,
                    as: 'Subjects',
                    attributes: ['subjectname', [sequelize.literal('"Subjects->studentsubjects"."marks"'), 'marks']],
                    through: {
                        attributes: [],
                    },
                },
            ],
            where: {
                studentid: studentid,
            },
        }).then(studentResults => {
            /*
                        var output = {},
                            output1 = {},
                            Results = [],
                            finalOutput = [],
                            Obj = JSON.stringify(studentResults),
                            myJSON = JSON.parse(Obj),
                            studentname = myJSON.forEach(element => {
                                var studentname = element.studentname;
                                var studentkey = Object.keys(element);
                                function pushTofinalOutput(studentkey, studentname) {
                                    output = {};
                                    output[studentkey] = studentname;
                                    finalOutput.push(output1)
                                }
                                pushTofinalOutput(studentkey, studentname);
                            }),
                            subjects = myJSON[0].Subjects;
                        subjects.forEach(element => {
                            var subjectname = element.subjectname;
                            var marks = element.marks;
                            function pushToResults(subjectname, marks) {
                                output1 = {};
                                output1[subjectname] = marks;
                                Results.push(output);
                            }
                            pushToResults(subjectname, marks);
                        });
                        var object = Object.assign({}, ...Results)
                        var object1 = Object.assign({}, ...finalOutput)
                        object1 = {
                            "Results": object
                        }
                        // finalOutput = {
                        //  "studentname":studentname,
                        //     "Results": object
                        // }
                        res.send(object1)*/
            var output = {}, Results = [], finalOutput = [], Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                var studentname = element['studentname'];
                var studentkey = Object.keys(element);
                function pushTofinalOutput(studentkey, studentname) {
                    output = {};
                    output[studentkey[0]] = studentname;
                    finalOutput.push(output);
                }
                pushTofinalOutput(studentkey, studentname);
                var subjects = element.Subjects;
                subjects.forEach(element => {
                    var subjectname = element.subjectname;
                    var marks = element.marks;
                    function pushToResults(subjectname, marks) {
                        output = {};
                        output[subjectname] = marks;
                        Results.push(output);
                    }
                    pushToResults(subjectname, marks);
                });
                var allResults = Object.assign({}, ...Results);
                var object = Object.assign({}, ...finalOutput, { allResults });
                res.send(object);
            });
        });
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
        let studentsubjectid = req.params.id, subjectid = req.body.subjectid, studentid = req.body.studentid, marks = req.body.marks, date = new Date();
        isExist(studentsubjectid).then(exists => {
            if (exists === true) {
                checkStudentSubject(studentid, subjectid).then(result => {
                    if (result == false) {
                        studentsubModel_1.studentsubjectModel.update({
                            studentid: studentid,
                            subjectid: subjectid,
                            marks: marks,
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