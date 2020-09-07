import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer';
import * as mailConfig from '../config';
import { studentModel } from '../model/studentModel';
import { subjectModel } from '../model/subjectModel';
import sequelize = require('sequelize');

const { Parser } = require('json2csv');

function getResults(studentid) {
    var whereClause;
    if (studentid == 'all') {
        whereClause = {}
    } else {
        whereClause = {
            studentid: studentid
        }
    }
    return studentModel.findAll({
        attributes: ['studentname'],
        include: [
            {
                model: subjectModel,
                as: 'Subjects',
                attributes: ['subjectname', [sequelize.literal('"Subjects->studentsubjects"."marks"'), 'marks']],
                through: {
                    attributes: [],
                },
            },
        ],
        where: whereClause,
    })
}

function arrangeResults(myJSON) {
    var allStudentResults = [];
    console.log(myJSON)
    myJSON.forEach(studentElement => {
        var total, percentage, output = {}, Marks = []
        if (myJSON.length > 1) {
            output[Object.keys(studentElement)[0]] = studentElement['studentname']
        }
        studentElement.Subjects.forEach(resultElement => {
            output[resultElement.subjectname] = resultElement.marks;
            Marks.push(resultElement.marks)
        });
        if (studentElement.Subjects.length != 0) {
            total = Marks.reduce(function (a, b) {
                return a + b;
            }, 0);
            percentage = (total * 100) / (studentElement.Subjects.length * 100);
        } else {
            total = "No results found!"
            percentage = "No results found!"
        }
        output['Total'] = total
        output['Percentage'] = percentage
        allStudentResults.push(output);
    })
    return allStudentResults;
}

export class resultsController {
    public getStudentResults(req: Request, res: Response) {
        let studentid = req.params.studentid;
        getResults(studentid).then(results => {
            var Obj = JSON.stringify(results),
                myJSON = JSON.parse(Obj),
                allResults
            myJSON.forEach(element => {
                var total, percentage, output = {}, Results = [], Marks = []
                element.Subjects.forEach(resultElement => {
                    output[resultElement.subjectname] = resultElement.marks;
                    Marks.push(resultElement.marks)
                });
                if (element.Subjects.length != 0) {
                    total = Marks.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    percentage = (total * 100) / (element.Subjects.length * 100);
                } else {
                    total = "No results found!"
                    percentage = "No results found!"
                }
                output['Total'] = total
                output['Percentage'] = percentage
                Results.push(output);
                allResults = {
                    "studentname": element.studentname,
                    "Results": Object.assign({}, ...Results)
                }
            });
            res.json(allResults)
        })
    }

    public resultsToCSV(req: Request, res: Response) {
        let studentid = req.params.studentid;
        getResults(studentid).then(results => {
            var Obj = JSON.stringify(results),
                myJSON = JSON.parse(Obj)
            var json2csv = new Parser(),
                csv = json2csv.parse(arrangeResults(myJSON));
            console.log(csv)
            // if (studentid != null) {
            //     console.log(csv, myJSON[0].studentname)
            //     res.setHeader('Content-disposition', 'attachment; filename=' + myJSON[0].studentname + ' Result.csv');
            //     res.set('Content-Type', 'text/csv');
            //     res.send(csv);
            // } else {
            //     console.log(csv, 'All Results')
            //     res.setHeader('Content-disposition', 'attachment; filename=ALL_STUDENT_RESULTS.csv');
            //     res.set('Content-Type', 'text/csv');
            //     res.send(csv);
            // }
        })
    }

    public mailResults(req: Request, res: Response) {
        let studentid = req.params.studentid,
            whereClause;
        if (studentid == 'all') {
            whereClause = {}
        } else {
            whereClause = {
                studentid: studentid
            }
        }
        studentModel.findAll({
            where: whereClause
        }).then(student => {
            student.forEach(element => {
                var studentid = element.studentid,
                    email = element.email;
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
                }
                transporter.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info)
                    }
                });
            });
        });
    }
}