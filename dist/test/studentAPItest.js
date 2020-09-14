"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const app_1 = require("../app");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expext = chai.expect, should = chai.should(), assert = chai.assert;
describe('User API', function () {
    describe('get /login', function () {
        it('should give authKey', done => {
            var credentials = {
                "username": "dsaroz",
                "password": "R@nd0m"
            };
            console.log('Logging in!');
            chai.request(app_1.default)
                .get('/login')
                .send(credentials)
                .end(function (err, res) {
                if (err)
                    console.log(err);
                //res.should.have('Login successful!');
                console.log('Response: ' + res.body);
                done();
            });
        });
    });
});
//# sourceMappingURL=studentAPItest.js.map