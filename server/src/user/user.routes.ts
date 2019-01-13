import { Application } from "express";
import { UserController } from "./user.controller";

/**
 * Classe de définition des routes liés à un utilisateur
 */
export class Routes { 
    
    public userController: UserController = new UserController();
    
    /**
     * Définition des routes liés à un utilisateur
     * @param app contexte de l'application express
     */
    public routes(app: Application): void {
        
        app.route('/user')
        .get(this.userController.getUsers)
        .post(this.userController.addNewUser);

        app.route('/user/:_id')
        .get(this.userController.getUserByID)
        .put(this.userController.updateUser)
        .delete(this.userController.deleteUser);

        app.route('/user/exists/:username')
        .get(this.userController.existsUser)

        app.route('/authenticate')
        .post(this.userController.authenticate)

    }
}