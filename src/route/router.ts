import { userController } from '../controller/userController';

export class Routes {
    public UserController: userController = new userController();

    public routes(app): void {
        app.route('/login').post(this.UserController.userLogin);
        app.route('/logout').post(this.UserController.userLogout);
    }
}