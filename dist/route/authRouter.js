"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const authenticationController_1 = require("../controller/authenticationController");
const resultsController_v2_1 = require("../controller/resultsController_v2");
const studentController_1 = require("../controller/studentController");
const studentsubController_1 = require("../controller/studentsubController");
const subjectController_1 = require("../controller/subjectController");
const userController_1 = require("../controller/userController");
class AuthRoutes {
    constructor() {
        this.StudentController = new studentController_1.studentController();
        this.SubjectController = new subjectController_1.subjectController();
        this.StudentSubjectController = new studentsubController_1.studentsubjectController();
        this.ResultsController = new resultsController_v2_1.resultsController();
        this.UserController = new userController_1.userController();
        this.AuthController = new authenticationController_1.authenticationController();
    }
    authRoutes(app) {
        //Student routes
        app.route('/getStudents').get(this.StudentController.getStudents);
        app.route('/addStudent').post(this.StudentController.addStudent);
        app.route('/updateStudent/:id').put(this.StudentController.udpateStudent);
        app.route('/deleteStudent/:id').delete(this.StudentController.deleteStudent);
        //Subject routes
        app.route('/getSubjects').get(this.SubjectController.getSubjects);
        app.route('/addSubject').post(this.SubjectController.addSubject);
        app.route('/updateSubject/:id').put(this.SubjectController.udpateSubject);
        app.route('/deleteSubject/:id').delete(this.SubjectController.deleteSubject);
        //Student subject routes
        app.route('/getStudentSubjects').get(this.StudentSubjectController.getStudentSubjects);
        app.route('/getSubjectByStudent/:studentid').get(this.StudentSubjectController.getSubjectByStudent);
        app.route('/addStudentSubject').post(this.StudentSubjectController.addStudentSubject);
        app.route('/updateStudentSubject/:id').put(this.StudentSubjectController.udpateStudentSubject);
        app.route('/deleteStudentSubject/:id').delete(this.StudentSubjectController.deleteStudentSubject);
        //Results routes
        app.route('/getStudentResults/:studentid').get(this.ResultsController.getStudentResults);
        app.route('/resultsToCSV/:studentid').get(this.ResultsController.resultsToCSV);
        app.route('/mailResults/:studentid').get(this.ResultsController.mailResults);
        // app.route('/resultset/:id').get(this.ResultsController.getResult);
        //Users routes
        app.route('/getUsers/:id?/:username?').get(this.UserController.getUser);
        app.route('/addUser').post(this.UserController.addUser);
        app.route('/updateUser/:username').put(this.UserController.updateUser);
        app.route('/deleteUser/:username').delete(this.UserController.deleteUser);
        app.route('/logout').post(this.UserController.userLogout);
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=authRouter.js.map