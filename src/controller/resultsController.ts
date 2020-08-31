import { Request, Response } from 'express';
import { studentModel } from '../model/studentModel';
import { subjectModel } from '../model/subjectModel';
import sequelize = require('sequelize');
const { Parser, transforms: { unwind, flatten } } = require('json2csv');

function fnFinalOutput(element) {
    var output = {}, finalOutput = [];
    var studentname = element['studentname'];
    var studentkey = Object.keys(element);
    function pushTofinalOutput(studentkey, studentname) {
        output = {};
        output[studentkey[0]] = studentname;
        finalOutput.push(output)
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

export class resultsController {
    public getStudentResults(req: Request, res: Response) {
        let studentid = req.params.studentid;
        studentModel.findAll({
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
            where: {
                studentid: studentid,
            },
        }).then(studentResults => {
            var Obj = JSON.stringify(studentResults),
                myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var allResults = Object.assign({}, ...fnResultOutput(subjects))
                var object = Object.assign({}, ...fnFinalOutput(element), { allResults })
                res.send(object);
            })
        });
    }

    public resultToCSV(req: Request, res: Response) {
        let studentid = req.params.studentid;
        studentModel.findAll({
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
            where: {
                // datedeleted: null,
                studentid: studentid,
            },
        }).then(studentResults => {
            var Obj = JSON.stringify(studentResults),
                myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                fnFinalOutput(element);
                var subjects = element.Subjects;
                fnResultOutput(subjects);
                var allResults = Object.assign({}, ...fnResultOutput(subjects)),
                    newJSON = [],
                    resultsValue = [],
                    resultsKeys = [],
                    secondObject = Object.assign({}, ...fnFinalOutput(element))
                Object.values(allResults).forEach(element => {
                    function pushToresultsValues(values) {
                        resultsValue.push(values)
                    }
                    pushToresultsValues(element);
                })
                var total = resultsValue.reduce(function (a, b) {
                    return a + b;
                }, 0.00);
                var percentage = (total * 100) / (fnResultOutput(subjects).length * 100);
                Object.keys(allResults).forEach(element => {
                    function pushToresultsKeys(keys) {
                        resultsKeys.push(keys);
                    }
                    pushToresultsKeys(element);
                })
                for (var i = 0; i < resultsKeys.length; i++) {
                    pushTonewJSON(resultsKeys[i], resultsValue[i], newJSON)
                }
                pushTonewJSON('Total', total, newJSON);
                pushTonewJSON('Percentange', percentage.toFixed(2), newJSON);

                var object = Object.assign({}, ...newJSON),
                    json2csv = new Parser(),
                    csv = json2csv.parse(object);
                console.log(csv);
                res.setHeader('Content-disposition', 'attachment; filename=' + Object.values(secondObject)[0] + ' Result.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            })
        })
    }
}

// studentModel.findAll({
        //     attributes: ['studentname'],
        //     include: [
        //         {
        //             model: subjectModel,
        //             as: 'Subjects',
        //             attributes: ['subjectname', [sequelize.literal('"Subjects->studentsubjects"."marks"'), 'marks']],
        //             through: {
        //                 attributes: [],
        //             },
        //         },
        //     ],
        //     where: {
        //         studentid: studentid,
        //     },
        // }).then(studentResults => {
        //     var output = {},
        //         Results = [],
        //         finalOutput = [],
        //         Obj = JSON.stringify(studentResults),
        //         myJSON = JSON.parse(Obj);
        //     myJSON.forEach(element => {
        //         var studentname = element['studentname'];
        //         var studentkey = Object.keys(element);
        //         function pushTofinalOutput(studentkey, studentname) {
        //             output = {};
        //             output[studentkey[0]] = studentname;
        //             finalOutput.push(output)
        //         }
        //         pushTofinalOutput(studentkey, studentname);
        //         var subjects = element.Subjects;
        //         subjects.forEach(element => {
        //             var subjectname = element.subjectname;
        //             var marks = element.marks;
        //             function pushToResults(subjectname, marks) {
        //                 output = {};
        //                 output[subjectname] = marks;
        //                 Results.push(output);
        //             }
        //             pushToResults(subjectname, marks);
        //         });
        //         var allResults = Object.assign({}, ...Results)
        //         var object = Object.assign({}, ...finalOutput, { allResults })