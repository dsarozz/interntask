"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultsController = void 0;
const nodemailer = require("nodemailer");
const mailConfig = require("../config");
const studentModel_1 = require("../model/studentModel");
const subjectModel_1 = require("../model/subjectModel");
const sequelize = require("sequelize");
const { Parser } = require('json2csv');
function getResults(studentid) {
    var whereClause;
    if (studentid == 'all') {
        whereClause = {};
    }
    else {
        whereClause = {
            studentid: studentid
        };
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
function arrangeResults(myJSON) {
    var allStudentResults = [];
    console.log(myJSON);
    myJSON.forEach(studentElement => {
        var total, percentage, output = {}, Marks = [];
        if (myJSON.length > 1) {
            output[Object.keys(studentElement)[0]] = studentElement['studentname'];
        }
        studentElement.Subjects.forEach(resultElement => {
            output[resultElement.subjectname] = resultElement.marks;
            Marks.push(resultElement.marks);
        });
        if (studentElement.Subjects.length != 0) {
            total = Marks.reduce(function (a, b) {
                return a + b;
            }, 0);
            percentage = (total * 100) / (studentElement.Subjects.length * 100);
        }
        else {
            total = "No results found!";
            percentage = "No results found!";
        }
        output['Total'] = total;
        output['Percentage'] = percentage;
        allStudentResults.push(output);
    });
    return allStudentResults;
}
class resultsController {
    getStudentResults(req, res) {
        let studentid = req.params.studentid;
        getResults(studentid).then(results => {
            var Obj = JSON.stringify(results), myJSON = JSON.parse(Obj), allResults;
            myJSON.forEach(element => {
                var total, percentage, output = {}, Results = [], Marks = [];
                element.Subjects.forEach(resultElement => {
                    output[resultElement.subjectname] = resultElement.marks;
                    Marks.push(resultElement.marks);
                });
                if (element.Subjects.length != 0) {
                    total = Marks.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    percentage = (total * 100) / (element.Subjects.length * 100);
                }
                else {
                    total = "No results found!";
                    percentage = "No results found!";
                }
                output['Total'] = total;
                output['Percentage'] = percentage;
                Results.push(output);
                allResults = {
                    "studentname": element.studentname,
                    "Results": Object.assign({}, ...Results)
                };
            });
            res.json(allResults);
        });
    }
    resultsToCSV(req, res) {
        let studentid = req.params.studentid;
        getResults(studentid).then(results => {
            var Obj = JSON.stringify(results), myJSON = JSON.parse(Obj);
            var json2csv = new Parser(), csv = json2csv.parse(arrangeResults(myJSON));
            console.log(csv);
            if (studentid != null) {
                res.setHeader('Content-disposition', 'attachment; filename=' + myJSON[0].studentname + ' Result.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            }
            else {
                res.setHeader('Content-disposition', 'attachment; filename=ALL_STUDENT_RESULTS.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            }
        });
    }
    mailResults(req, res) {
        let studentid = req.params.studentid, whereClause;
        // var csvPath = request({
        //     headers: {
        //         'authKey': req.get('authKey'),
        //         'UID': req.get('UID')
        //     },
        //     uri: 'http://localhost:4000/resultsToCSV/' + studentid,
        //     method: 'GET'
        // }).on('response', function (response) {
        //     return response
        // })
        // var csvPath = fetch('http://localhost:4000/resultsToCSV/' + studentid, {
        //     method: 'GET',
        //     headers: {
        //         "authKey": req.get('authKey'),
        //         "UID": req.get('UID')
        //     }
        // }).then(data => {
        //     return csvPath = data;
        // })
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
                        pass: 'Naimatavandina!'
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
                            href: 'http://localhost:4000/resultsToCSV/' + studentid,
                            httpHeaders: {
                                'authKey': req.get('authKey'),
                                'UID': req.get('UID')
                            }
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
        });
    }
}
exports.resultsController = resultsController;
//# sourceMappingURL=resultsController_v2.js.map