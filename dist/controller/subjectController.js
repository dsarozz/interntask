"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectController = void 0;
const subjectModel_1 = require("../model/subjectModel");
function isExist(subjectid) {
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
class subjectController {
    getSubjects(req, res) {
        subjectModel_1.subjectModel.findAll({
            where: {
                datedeleted: null,
            },
            attributes: {
                include: ['subjectid'],
            }
        }).then(subjects => res.json(subjects));
    }
    addSubject(req, res) {
        let subjectName = req.body.subjectname;
        const params = req.body;
        subjectModel_1.subjectModel.create(params).then(result => {
            res.send('Successfully added subject ' + subjectName);
        }).catch(error => {
            res.send('Failed to add due to error :' + error);
        });
    }
    udpateSubject(req, res) {
        let subjectid = req.params.id;
        let date = new Date();
        isExist(subjectid).then(exists => {
            if (exists === true) {
                subjectModel_1.subjectModel.update({
                    subjectname: req.body.subjectname,
                    datemodified: date,
                }, {
                    where: {
                        subjectid: subjectid
                    }
                }).then(result => {
                    res.send('Update successful for ID :' + subjectid);
                }).catch(error => {
                    res.send('Update failed due to error :' + error);
                });
            }
            else {
                res.send('Record not found!');
            }
        });
    }
    deleteSubject(req, res) {
        let subjectid = req.params.id;
        let date = new Date();
        isExist(subjectid).then(exists => {
            if (exists === true) {
                subjectModel_1.subjectModel.update({
                    datedeleted: date,
                }, {
                    where: {
                        subjectid: subjectid
                    }
                }).then(result => {
                    res.send('Delete successful for ID :' + subjectid + 'on :' + date);
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
exports.subjectController = subjectController;
//# sourceMappingURL=subjectController.js.map