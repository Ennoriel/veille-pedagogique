import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User, UserModel } from './user.types'
import { MongoError } from 'mongodb';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

/**
 * Classe de services liés à un utilisateur
 */
export class UserController{

    /**
     * Création d'un nouvel utilisateur
     * 
     * @param req requête
     * @param res réponse
     */
    public addNewUser (req: Request, res: Response) {                
        let newUser = new UserModel(req.body);
        newUser.password = bcrypt.hashSync(newUser.password, 10);
    
        newUser.save((err: MongoError, user: User) => {
            if(err){
                res.send(err);
                return;
            }
            user.password = null;
            res.json(user);
        });
    }

    /**
     * Réccupération de tous les utilisateurs
     * 
     * @param req requête
     * @param res réponse
     */
    public getUsers (req: Request, res: Response) {           
        UserModel.find({}, (err: MongoError, user: User) => {
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
     * Réccupération d'un utilisateur par son identifiant technique
     * 
     * @param req requête
     * @param res réponse
     */
    public existsUser (req: Request, res: Response) {
        UserModel.findOne({'username' : req.params.username}, (err: MongoError, user: User) => {
            if(err){
                console.log('erreur grave');
                res.status(400).send(err);
                return;
            }
            if(user == null) {
                console.log('erreur');
                res.status(200).send(false);
                return;
            }
            console.log('ok');
            res.status(200).send(true);
        });
    }

    /**
     * Mets à jour un utilisateur
     * 
     * @param req requête
     * @param res réponse
     */
    public updateUser (req: Request, res: Response) {
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
    public authenticate (req: Request, res: Response) {           
        UserModel.findOne({ username: req.body.username }, (err: MongoError, user: User) => {
            if(err){
                res.send({ message : "Unable to authenticate user"});
                return;
            }
            if(user == null || !bcrypt.compareSync(req.body.password, user.password)) {
                res.send({ message : "Unable to authenticate user"});
                return;
            }
            user['password'] = undefined;
            user['_id'] = undefined;
            res.set('Authorization', jwt.sign({_id : user._id}, 'SECRET')).send(user);
        });
    }
    
}