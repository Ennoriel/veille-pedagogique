import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User, UserModel, UserRight } from './user.types'
import { MongoError } from 'mongodb';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

/**
 * Classe de services liés à un utilisateur
 */
export class UserController{

    constructor () { }

    /**
     * Création d'un nouvel utilisateur
     * 
     * @param req requête
     * @param res réponse
     */
    public addNewUser = (req: Request, res: Response) => {                
        let newUser = new UserModel(req.body);

        if (newUser.password == null || newUser.password.length < 12) {
            res.status(400).send({code:"erreur", message: "Le mot de passse doit contenir au moins 12 caractères."});
            return;
        }

        newUser.password = bcrypt.hashSync(newUser.password, 10);
        newUser.right = UserRight.BEARER_FREE;
    
        newUser.save((err: MongoError, user: User) => {
            if(err){
                res.status(400).send(err);
                return;
            }
            
            res.set('Authorization', this.getAuthToken(user)).send(this.removeCredentials(user));
        });
    }

    /**
     * Réccupération de tous les utilisateurs
     * 
     * @param req requête
     * @param res réponse
     */
    public getUsers (req: Request, res: Response) {           
        UserModel.find({

        }, {
            username: 1,
            lastname: 1,
            firstname: 1,
            email: 1,
            right: 1
        }, (err: MongoError, user: Array<User>) => {
            if(err){
                res.send(err);
                return;
            }
            res.json(user);
        });
    }

    /**
     * Réccupération d'un utilisateur par son identifiant technique
     * 
     * @param req requête
     * @param res réponse
     */
    public getUserByID (req: Request, res: Response) {
        UserModel.findById(req.params._id, (err: MongoError, user: User) => {
            if(err){
                res.send(err);
                return;
            }
            res.json(user);
        });
    }

    /**
     * Permet de tester l'existance d'un utilisateur
     * Méthode asynchrone, pour envoit HTTP
     * 
     * @param req requête
     * @param res réponse
     */
    public existsUser (req: Request, res: Response) {
        UserModel.findOne({'username' : req.params.username}, (err: MongoError, user: User) => {
            if(err){
                // Erreur non géré
                res.status(400).send(err);
                return;
            }
            if(user == null) {
                // Utilisateur non connu de la BDD
                res.status(200).send(false);
                return;
            }
            // Utilisateur connu de la BDD
            res.status(200).send(true);
        });
    }

    /**
     * Permet de tester l'existance d'un utilisateur
     * Méthode asynchrone, pour usage interne
     * 
     * @param _id identifiant technique de l'utilisateur
     */
    public existsUserById (_id: string) {
        return UserModel.findById(_id, {_id: 1})
    }

    /**
     * Mets à jour un utilisateur
     * 
     * @param req requête
     * @param res réponse
     */
    public updateUser (req: Request, res: Response) {

        let user = req.body;

        if(user._id) {
            delete user._id;
        }

        UserModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err: MongoError, user: User) => {
            if(err){
                res.send(err);
                return;
            }
            res.json(user);
        });
    }

    /**
     * Supprime un utilisateur
     * 
     * @param req requête
     * @param res réponse
     */
    public deleteUser (req: Request, res: Response) {           
        UserModel.remove({ _id: req.params._id }, (err: MongoError) => {
            if(err){
                res.send(err);
                return;
            }
            res.json({ message: 'Successfully deleted User!'});
        });
    }

    /**
     * Authentification d'un utilisateur à l'application. Génère un jeton JWT
     * 
     * @param req requête
     * @param res réponse
     */
    public authenticate = (req: Request, res: Response) => {           
        UserModel.findOne({ username: req.body.username }, (err: MongoError, user: User) => {
            if(err){
                res.status(400).send({ message : "Unable to authenticate you with the username and password provided."});
                return;
            }
            if(user == null || !bcrypt.compareSync(req.body.password, user.password)) {
                res.status(400).send({ message : "Unable to authenticate you with the username and password provided."});
                return;
            }
            
            res.set('Authorization', this.getAuthToken(user)).send(this.removeCredentials(user));
        });
    }
    
    /**
     * Define Authentication Token
     * @param user User
     */
    private getAuthToken(user: User) {
        const { _id, right } = user;
        return jwt.sign({ _id, right }, process.env.JWT_SECRET);
    }

    /**
     * remove the _id and password fields
     * @param user User
     */
    private removeCredentials(user: User) {
        let newUser = JSON.parse(JSON.stringify(user));
        delete newUser._id;
        delete newUser.password;
        return newUser;
    }
}