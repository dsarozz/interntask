"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultsController = void 0;
const studentModel_1 = require("../model/studentModel");
const subjectModel_1 = require("../model/subjectModel");
const mailConfig = require("../config");
const nodemailer = require("nodemailer");
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
        let studentid = req.params.studentid;
        studentObject(studentid).then(studentResults => {
            var Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj), allStudentResults = [];
            console.log(myJSON);
            myJSON.forEach(element => {
                var subjects = element.Subjects;
                var allResults = Object.assign({}, ...fnResultOutput(subjects));
                var object = Object.assign({}, ...fnFinalOutput(element), { allResults });
                allStudentResults.push(object);
            });
            console.log(allStudentResults);
            res.send(allStudentResults);
            //         var allResults = Object.assign({}, ...Results)
            //         var object = Object.assign({}, ...finalOutput, { allResults })
        });
    }
    resultsToCSV(req, res) {
        let studentid = req.params.studentid;
        studentObject(studentid).then(studentResults => {
            var allStudentResults = [], csv, secondObject, Obj = JSON.stringify(studentResults), myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                var finalOutput = Object.assign({}, ...fnFinalOutput(element)), resultsKeys = [], resultsValues = [];
                secondObject = Object.assign({}, ...fnFinalOutput(element));
                if (studentid == null) {
                    resultsKeys = Object.keys(finalOutput);
                    resultsValues = Object.values(finalOutput);
                }
                csv = j2c(element, resultsKeys, resultsValues, allStudentResults);
            });
            var json2csv = new Parser(), csv = json2csv.parse(allStudentResults);
            if (studentid != null) {
                console.log(csv, secondObject.studentname);
                res.setHeader('Content-disposition', 'attachment; filename=' + secondObject.studentname + ' Result.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            }
            else {
                console.log(csv, 'All Results');
                res.setHeader('Content-disposition', 'attachment; filename=ALL_STUDENT_RESULTS.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            }
        });
    }
    mailResult(req, res) {
        let studentid = req.params.studentid, whereClause;
        if (studentid == 'all') {
            whereClause = {};
        }
        else {
            whereClause = {
                studentid: studentid
            };
        }
        studentModel_1.studentModel.findAll({
            where: whereClause
        }).then(student => {
            student.forEach(element => {
                var studentid = element.studentid, email = element.email;
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: mailConfig.fromMail,
                        pass: 'Password here'
                    }
                });
                var message = {
                    from: mailConfig.fromMail,
                    to: email,
                    subject: mailConfig.subject,
                    html: '<h1>Your Result Is Here !</h1><p>Download your result from the attachment<p>',
                    attachments: [
                        {
                            filename: 'Result.csv',
                            path: 'http://localhost:4000/resultsToCSV/' + studentid
                        }
                    ]
                };
                transporter.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(info);
                    }
                });
            });
            // res.send('Mail successfully sent to: ' + email.toString)
        });
    }
}
exports.resultsController = resultsController;
//Get Result using Map || ALTERNATIVE
// public getResult(req: Request, res: Response) {
//     let studentid = req.params.id
//     var whereClause;
//     if (studentid == 'all') {
//         whereClause = {}
//     } else {
//         whereClause = {
//             studentid: studentid
//         }
//     }
//     studentModel.findAll({
//         attributes: ['studentname'],
//         where: whereClause,
//         include: [{
//             model: subjectModel,
//             as: 'Subjects',
//             attributes: ['subjectname'],
//             through: {
//                 attributes: ['marks']
//             }
//         }]
//     }).then(result => {
//         var allResults = []
//         for (var i = 0; i < result.length; i++) {
//             var resObj = arrangeResult(result)
//             console.log(resObj)
//             allResults.push(resObj);
//         }
//         res.send(allResults);
//     })
// }
// function arrangeResult(results) {
//     let result = results.map(student => {
//         var Subjects = student.Subjects.map(subjects => {
//             var subjectname = subjects.subjectname,
//                 marks = subjects.studentsubjects.marks,
//                 Results = {
//                     [subjectname]: marks
//                 }
//             return Results;
//         })
//         var subjectResults = Subjects.reduce(function (Key, Value) {
//             Object.keys(Value).forEach(element => {
//                 Key[element] = Value[element]
//             })
//             return Key
//         }, {});
//         var total = Subjects.map(element => Object.values(element)).reduce((a, b) => parseInt(a) + parseInt(b))
//         var allResults = {
//             "studentname": `"${student.studentname}"`,
//             "Results": subjectResults,
//             "Total": total
//         }
//         return allResults
//     })
//     console.log(result);
//     return result;
// }
//# sourceMappingURL=resultsController.js.map