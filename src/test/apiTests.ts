import 'mocha';
import * as chai from 'chai';
import app from '../app';
import chaiHttp = require('chai-http');
import { DATE } from 'sequelize';
import { expect } from 'chai';

chai.use(chaiHttp);

const expext = chai.expect,
    should = chai.should(),
    assert = chai.assert;

//USERS API TEST
describe('User API', function () {
    var form: {
        "username": "tsushan",
        "password": "Nepal",
        "firstname": "Sushan",
        "lastname": "Tuladhar"
    },
        updateForm: {
            "username": "tusushan",
            "password": "Kathmandu",
            "firstname": "Sushan",
            "lastname": "Tuladhar"
        }, id = 5

    it('should give a response of login status and authKey', done => {
        var credentials = {
            "username": "dsaroz",
            "password": "R@nd0m"
        }
        console.log('Logging in!');
        chai.request(app)
            .post('/login/')
            .send(credentials)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text);
                done();
            })
    })

    it('should get all students', function (done) {
        chai.request(app)
            .get('/getUsers/')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

    it('should add student', function (done) {
        chai.request(app)
            .post('/addUser')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(form)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.text)
                done();
            })
    })

    it('should udpate student', (done) => {
        chai.request(app)
            .put('/updateUser/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(updateForm)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })

    it('should delete student', (done) => {
        chai.request(app)
            .delete('/deleteUser/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })
})

//STUDENTS API TEST
describe('Student API', function () {
    var form: {
        "studentname": "Sushan",
        "address": "Nepal",
        "email": "sushan.tuladhar@procit.com",
    },
        updateForm: {
            "studentname": "Sushan",
            "address": "Kathmandu",
            "email": "sushan.tuladhar@procit.com",
        }, id = 5

    it('should get all students', function (done) {
        chai.request(app)
            .get('/getStudents/')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

    it('should add student', function (done) {
        chai.request(app)
            .post('/addStudent')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(form)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.text)
                done();
            })
    })

    it('should udpate student', (done) => {
        chai.request(app)
            .put('/updateStudent/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(updateForm)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })

    it('should delete student', (done) => {
        chai.request(app)
            .delete('/deleteStudent/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })
})

//SUBJECTS API TEST
describe('Subject API', function () {
    var form: {
        "subjectname": "Math"
    },
        updateForm: {
            "subjectname": "Mathematics"
        },
        id = 5
    it('should get all subjects', function (done) {
        chai.request(app)
            .get('/getSubjects/')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

    it('should add subject', function (done) {
        chai.request(app)
            .post('/addSubjects')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(form)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.text)
                done();
            })
    })

    it('should udpate student', (done) => {
        chai.request(app)
            .put('/updateSubject/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(updateForm)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })

    it('should delete subject', (done) => {
        chai.request(app)
            .delete('/deleteSubject/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })
})

//STUDENTSUBJECTS API TEST
describe('Studentsubject API', function () {
    var form: {
        "subjectid": "2",
        "studentid": "3",
        "marks": "80"
    },
        updateForm: {
            "subjectid": "2",
            "studentid": "3",
            "marks": "50"
        },
        id = 5

    it('should get all studentsubjects', function (done) {
        chai.request(app)
            .get('/getStudentSubjects/')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) done(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

    it('should add studentsubject', function (done) {
        chai.request(app)
            .post('/addStudentSubject')
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(form)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ', res.text)
                done();
            })
    })

    it('should udpate studentsubject', (done) => {
        chai.request(app)
            .put('/updateStudentSubject/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .send(updateForm)
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })

    it('should delete StudentSubject', (done) => {
        chai.request(app)
            .delete('/deleteStudentSubject/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) console.log(err);
                res.should.have.status(200);
                console.log('Response: ' + res.text)
                done();
            })
    })
})

//RESULTS API TESTS
describe('Results API', function () {
    var id = 5

    it('should get all studentsubjects', function (done) {
        chai.request(app)
            .get('/getStudentResults/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) done(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

    it('should convert json results to downloadable CSV', function (done) {
        chai.request(app)
            .get('/getResultsToCSV/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) done(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })
    it('should mail results', function (done) {
        chai.request(app)
            .get('/mailResults/' + id)
            .set('authKey', 'fe110b9c-d9d7-48b8-8f94-868d36dd5462')
            .set('UID', '39')
            .end(function (err, res) {
                if (err) done(err);
                res.should.have.status(200);
                console.log('Response: ', res.body)
                done();
            })
    })

})