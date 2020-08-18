const sequelize = require('sequelize');

var connection = new sequelize('student_db', 'postgres', 'root', {
    dialect: 'postgres'
});

try {
    connection.authenticate();
    console.log('Connection to the database successful.')
} catch (error) {
    console.log('Unable to connecto to the database due to error :' + error);
}

module.exports = connection;