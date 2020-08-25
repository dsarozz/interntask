"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const studentController_1 = require("../controller/studentController");
const studentsubController_1 = require("../controller/studentsubController");
const subjectController_1 = require("../controller/subjectController");
class Routes {
    constructor() {
        this.StudentController = new studentController_1.studentController();
        this.SubjectController = new subjectController_1.subjectController();
        this.StudentSubjectController = new studentsubController_1.studentsubjectController();
    }
    routes(app) {
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
        app.route('/addStudentSubject').post(this.StudentSubjectController.addStudentSubject);
        app.route('/updateStudentSubject/:id').put(this.StudentSubjectController.udpateStudentSubject);
        app.route('/deleteStudentSubject/:id').delete(this.StudentSubjectController.deleteStudentSubject);
        app.route('/getSubjectByStudent/:studentid').get(this.StudentSubjectController.getSubjectByStudent);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=router.js.map