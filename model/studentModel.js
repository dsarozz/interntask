const sequelize = require('sequelize');
const connection = require('../dbConnection');

const studentModel = connection.define('students', {
    studentid: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncreament: true
    },
    studentname: {
        type: sequelize.STRING
    },
    address: {
        type: sequelize.STRING
    },
    datecreated: {
        type: sequelize.DATE
    },
    datemodified: {
        type: sequelize.DATE
    },
    datedeleted: {
        type: sequelize.DATE
    },

},
    {
        freezeTbleName: true,
        timestamps: false
    });

studentModel.removeAttribute('studentid');
module.exports = studentModel;