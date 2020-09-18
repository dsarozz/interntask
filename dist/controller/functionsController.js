"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionController = void 0;
const studentsubModel_1 = require("../model/studentsubModel");
const sequelize = require("sequelize");
class functionController {
    insertbyJSON(req, res) {
        let json_data = JSON.stringify(req.body);
        studentsubModel_1.studentsubjectModel.sequelize.query(`select insert_using_json('${json_data}'::json)`, {
            type: sequelize.QueryTypes.SELECT,
        }).then(function (result) {
            res.send('Successfully inserted!');
        }).catch(function (err) {
            res.send(err);
        });
    }
    insertJson(req, res) {
        let json_data = JSON.stringify(req.body);
        studentsubModel_1.studentsubjectModel.sequelize.query(`select insert_json_data('${json_data}'::json)`, {
            type: sequelize.QueryTypes.SELECT
        }).then(function (results) {
            res.send('Successfully added');
        }).catch(function (err) {
            res.send(err);
        });
    }
    resultsUsingRawQuery(req, res) {
        let studentid = req.params.studentid;
        studentsubModel_1.studentsubjectModel.sequelize.query('select results_by_student_to_json(' + studentid + ')', {
            type: sequelize.QueryTypes.SELECT
        }).then(function (result) {
            console.log(result);
            res.json(result[0]);
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    }
}
exports.functionController = functionController;
//# sourceMappingURL=functionsController.js.map