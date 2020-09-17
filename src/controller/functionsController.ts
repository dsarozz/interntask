import { Request, Response } from 'express';
import { studentsubjectModel } from '../model/studentsubModel';
import sequelize = require('sequelize');

export class functionController {
    public insertbyJSON(req: Request, res: Response) {
        let json_data = JSON.stringify(req.body);
        studentsubjectModel.sequelize.query(`select insert_using_json('${json_data}'::json)`, {
            type: sequelize.QueryTypes.SELECT,
        }).then(function (result) {
            console.log(result);
            res.send('Successfully inserted!')
        }).catch(function (err) {
            res.send(err);
        })
    }

    public resultsUsingRawQuery(req: Request, res: Response) {
        let studentid = req.params.studentid;
        studentsubjectModel.sequelize.query('select results_by_student_to_json(' + studentid + ')', {
            type: sequelize.QueryTypes.SELECT
        }).then(function (result) {
            console.log(result);
            res.json(result[0])
        }).catch(function (err) {
            console.log(err)
            res.send(err)
        })
    }
}