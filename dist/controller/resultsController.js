"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultsController = void 0;
const studentModel_1 = require("../model/studentModel");
const subjectModel_1 = require("../model/subjectModel");
const sequelize = require("sequelize");
const { Parser } = require('json2csv');
function studentObject(studentid) {
    var whereClause;
    if (studentid != null) {
        whereClause = {
            studentid: studentid
        };
    }
    else {
        whereClause = {};
    }
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
        where: whereClause,
    });
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
function j2c(element, resultsKeys, resultsValues, allStudentResults) {
    var subjects = element.Subjects, allResults = Object.assign({}, ...fnResultOutput(subjects)), newJSON = [], resultsTotal = [];
    Object.values(allResults).forEach(element => {
        pushToresultsValues(element, resultsValues);
        pushToresultsValues(element, resultsTotal);
    });
    var total = resultsTotal.reduce(function (a, b) {
        return a + b;
    }, 0);
    var percentage = (total * 100) / (fnResultOutput(subjects).length * 100);
    Object.keys(allResults).forEach(element => {
        pushToresultsKey(element, resultsKeys);
    });
    for (var i = 0; i < resultsKeys.length; i++) {
        pushTonewJSON(resultsKeys[i], resultsValues[i], newJSON);
    }
    pushTonewJSON('Total', total, newJSON);
    pushTonewJSON('Percentage', percentage.toFixed(2), newJSON);
    var newJSONObj = Object.assign({}, ...newJSON);
    allStudentResults.push(newJSONObj);
    return allStudentResults;
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
                var allStudentResults = [], resultsValues = [], resultsKeys = [], secondObject = Object.assign({}, ...fnFinalOutput(element));
                var csv = j2c(element, resultsKeys, resultsValues, allStudentResults);
                var json2csv = new Parser(), csv = json2csv.parse(allStudentResults);
                console.log(csv);
                res.setHeader('Content-disposition', 'attachment; filename=' + secondObject.studentname + ' Result.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            });
        });
    }
    resultsToCSV(req, res) {
        studentObject(null).then(studentResults => {
            var allStudentResults = [], csv, Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var finalOutput = Object.assign({}, ...fnFinalOutput(element)), resultsKeys = Object.keys(finalOutput), resultsValues = Object.values(finalOutput);
                csv = j2c(element, resultsKeys, resultsValues, allStudentResults);
            });
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