import { Request, Response } from 'express';
import { studentModel } from '../model/studentModel';
import { studentsubjectCreationAttributes, studentsubjectModel } from '../model/studentsubModel';
import { subjectModel } from '../model/subjectModel';
import sequelize = require('sequelize');
const { Parser, transforms: { unwind, flatten } } = require('json2csv');

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
            var output = {},
                Results = [],
                finalOutput = [],
                Obj = JSON.stringify(studentResults),
                myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                var studentname = element['studentname'];
                var studentkey = Object.keys(element);
                function pushTofinalOutput(studentkey, studentname) {
                    output = {};
                    output[studentkey[0]] = studentname;
                    finalOutput.push(output)
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
                var allResults = Object.assign({}, ...Results)
                var object = Object.assign({}, ...finalOutput, { allResults })
                res.send(object)
            })
        })
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
            console.log(JSON.stringify(studentResults))
            var output = {},
                Results = [],
                finalOutput = [],
                Obj = JSON.stringify(studentResults),
                myJSON = JSON.parse(Obj);
            myJSON.forEach(element => {
                var studentname = element['studentname'];
                var studentkey = Object.keys(element);
                function pushTofinalOutput(studentkey, studentname) {
                    output = {};
                    output[studentkey[0]] = studentname;
                    finalOutput.push(output)
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
                var allResults = Object.assign({}, ...Results),
                    secondObject = Object.assign({}, ...finalOutput),
                    newJSON = [],
                    resultsValue = Object.values(secondObject),
                    resultsKeys = Object.keys(secondObject)

                Object.values(allResults).forEach(element => {
                    function pushToresultsValues(values) {
                        resultsValue.push(values)
                    }
                    pushToresultsValues(element)
                })
                Object.keys(allResults).forEach(element => {
                    function pushToresultsKeys(keys) {
                        resultsKeys.push(keys);
                    }
                    pushToresultsKeys(element);
                })
                for (var i = 0; i < resultsKeys.length; i++) {
                    function pushTonewJSON(keyElement, valueElement) {
                        output = {};
                        output[keyElement] = valueElement;
                        newJSON.push(output);
                    }
                    pushTonewJSON(resultsKeys[i], resultsValue[i])
                }
                var object = Object.assign({}, ...newJSON),
                    json2csv = new Parser(),
                    csv = json2csv.parse(object);
                console.log(csv);
                res.setHeader('Content-disposition', 'attachment; filename=data.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv);
            })
        })
    }
}