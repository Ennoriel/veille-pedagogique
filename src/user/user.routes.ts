import { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";

export class Routes { 
    
    public userController: UserController = new UserController();
    
    public routes(app): void {
        
        app.route('/user')
        .get(this.userController.getUsers)
        .post(this.userController.addNewUser);

        app.route('/user/:_id')
        .get(this.userController.getUserWithID)
        .put(this.userController.updateUser)
        .delete(this.userController.deleteUser);

        app.route('/authenticate')
        .post(this.userController.authenticate)

    }
}