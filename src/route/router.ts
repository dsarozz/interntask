import { userController } from '../controller/userController';
import { resultsController } from '../controller/resultsController_v2';

export class Routes {
    public UserController: userController = new userController();
    public ResultsController: resultsController = new resultsController();

    public routes(app): void {
        app.route('/login').post(this.UserController.userLogin);
    }
}