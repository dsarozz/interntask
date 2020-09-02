"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultsController = void 0;
const studentModel_1 = require("../model/studentModel");
const subjectModel_1 = require("../model/subjectModel");
const sequelize = require("sequelize");
const { Parser, transforms: { unwind, flatten } } = require('json2csv');
function studentObject(studentid) {
    if (studentid != null) {
        return studentModel_1.studentModel.findAll({
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
        });
    }
    else {
        return studentModel_1.studentModel.findAll({
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
            ]
        });
    }
}
function fnFinalOutput(element) {
    var output = {}, finalOutput = [];
    var studentname = element['studentname'];
    var studentkey = Object.keys(element);
    function pushTofinalOutput(studentkey, studentname) {
        output = {};
        output[studentkey[0]] = studentname;
        finalOutput.push(output);
    }
    pushTofinalOutput(studentkey, studentname);
    return finalOutput;
}
function fnResultOutput(subjects) {
    var output = {}, Results = [];
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
    return Results;
}
function pushTonewJSON(keyElement, valueElement, newJSON) {
    var output = {};
    output[keyElement] = valueElement;
    newJSON.push(output);
}
function pushToresultsValues(values, resultsValue) {
    resultsValue.push(values);
}
function pushToresultsKey(keys, resultsKey) {
    resultsKey.push(keys);
}
class resultsController {
    getStudentResults(req, res) {
        studentObject(null).then(studentResults => {
            var Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj), allStudentResults = [];
            console.log(myJSON);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var allResults = Object.assign({}, ...fnResultOutput(subjects));
                var object = Object.assign({}, ...fnFinalOutput(element), { allResults });
                allStudentResults.push(object);
            });
            console.log(allStudentResults);
            res.send(allStudentResults);
        });
    }
    getStudentResult(req, res) {
        let studentid = req.params.studentid;
        studentObject(studentid).then(studentResults => {
            var Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            console.log(myJSON);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var allResults = Object.assign({}, ...fnResultOutput(subjects));
                var object = Object.assign({}, ...fnFinalOutput(element), { allResults });
                res.send(object);
            });
            //         var allResults = Object.assign({}, ...Results)
            //         var object = Object.assign({}, ...finalOutput, { allResults })
        });
    }
    resultToCSV(req, res) {
        let studentid = req.params.studentid;
        studentObject(studentid).then(studentResults => {
            var Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var allResults = Object.assign({}, ...fnResultOutput(subjects)), newJSON = [], resultsValue = [], resultsKeys = [], secondObject = Object.assign({}, ...fnFinalOutput(element));
                Object.values(allResults).forEach(element => {
                    pushToresultsValues(element, resultsValue);
                });
                var total = resultsValue.reduce(function (a, b) {
                    return a + b;
                }, 0.00);
                var percentage = (total * 100) / (fnResultOutput(subjects).length * 100);
                Object.keys(allResults).forEach(element => {
                    pushToresultsKey(element, resultsKeys);
                });
                for (var i = 0; i < resultsKeys.length; i++) {
                    pushTonewJSON(resultsKeys[i], resultsValue[i], newJSON);
                }
                pushTonewJSON('Total', total, newJSON);
                pushTonewJSON('Percentange', percentage.toFixed(2), newJSON);
                var object = Object.assign({}, ...newJSON), json2csv = new Parser(), csv = json2csv.parse(object);
                console.log(csv);
                res.setHeader('Content-disposition', 'attachment; filename=' + Object.values(secondObject)[0] + ' Result.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            });
        });
    }
    resultsToCSV(req, res) {
        studentObject(null).then(studentResults => {
            var allStudentResults = [], Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            console.log(myJSON);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var newJSON = [], resultsTotal = [], percentage = 0, allResult = Object.assign({}, ...fnResultOutput(subjects)), finalOutput = Object.assign({}, ...fnFinalOutput(element)), resultsKeys = Object.keys(finalOutput), resultsValues = Object.values(finalOutput);
                Object.values(allResult).forEach(element => {
                    pushToresultsValues(element, resultsValues);
                    pushToresultsValues(element, resultsTotal);
                });
                var total = resultsTotal.reduce(function (a, b) {
                    return a + b;
                }, 0);
                percentage = (total * 100) / (fnResultOutput(subjects).length * 100);
                Object.keys(allResult).forEach(element => {
                    pushToresultsKey(element, resultsKeys);
                });
                for (var i = 0; i < resultsKeys.length; i++) {
                    pushTonewJSON(resultsKeys[i], resultsValues[i], newJSON);
                }
                pushTonewJSON('Total', total, newJSON);
                pushTonewJSON('Percentage', percentage.toFixed(2), newJSON);
                var newJSONObj = Object.assign({}, ...newJSON);
                allStudentResults.push(newJSONObj);
                console.log(newJSON);
            });
            console.log(allStudentResults);
            var json2csv = new Parser(), csv = json2csv.parse(allStudentResults);
            console.log(csv);
            res.setHeader('Content-disposition', 'attachment; filename=ALL_STUDENT_RESULTS.csv');
            res.set('Content-Type', 'text/csv');
            res.send(csv);
        });
    }
}
exports.resultsController = resultsController;
//# sourceMappingURL=resultsController.js.map