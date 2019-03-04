import * as express from "express";

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
    get routes(): express.Router {
        
        let router = express.Router();
        
        router.route('/user')
        .get(this.userController.getUsers)
        .post(this.userController.addNewUser);

        router.route('/user/:_id')
        .get(this.userController.getUserByID)
        .put(this.userController.updateUser)
        .delete(this.userController.deleteUser);

        router.route('/user/exists/:username')
        .get(this.userController.existsUser)

        router.route('/authenticate')
        .post(this.userController.authenticate)

        return router;
    }
}