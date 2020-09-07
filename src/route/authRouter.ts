import { authenticationController } from '../controller/authenticationController';
import { resultsController } from '../controller/resultsController_v2';
import { studentController } from '../controller/studentController';
import { studentsubjectController } from '../controller/studentsubController';
import { subjectController } from '../controller/subjectController';
import { userController } from '../controller/userController';

export class AuthRoutes {
    public StudentController: studentController = new studentController();
    public SubjectController: subjectController = new subjectController();
    public StudentSubjectController: studentsubjectController = new studentsubjectController();
    public ResultsController: resultsController = new resultsController();
    public UserController: userController = new userController();
    public AuthController: authenticationController = new authenticationController();

    public authRoutes(app): void {
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