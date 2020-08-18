const studentModel = require('../model/studentModel');

const studentController = {
    getStudent(req, res) {
        studentModel.findAll({
            where: { datedeleted: null },
            attributes: { include: ['studentid'] }
        }).then(students => res.json(students));
    },

    addStudent(req, res) {
        studentModel.create({
            studentname: req.body.studentname,
            address: req.body.address
        }).then(result => {
            res.send('Successfully added:' + studentname);
        }).catch(error => {
            res.send('Failed to add due to error: ' + error);
        })
    },

    updateStudent(req, res) {
        let id = req.params.id;
        let date = new Date();
        studentModel.update({
            studentname: req.body.studentname,
            address: req.body.address,
            datemodified: date,
        }, {
            where: {
                studentid: id
            }
        }).then(result => {
            res.send('Updated Successfully at :' + date);
        }).catch(error => {
            res.send('Update failed due to error :' + error);
        })
    },
    deleteStudent(req, res) {
        let id = req.params.id;
        let date = new Date();
        studentModel.update({
            datedeleted: date
        }, {
            where: {
                studentid: id
            }
        }).then(result => {
            res.send('Deleted Successfully at :' + date);
        }).catch(error => {
            res.send('Delete failed due to error :' + error);
        })
    }
}

module.exports = studentController;