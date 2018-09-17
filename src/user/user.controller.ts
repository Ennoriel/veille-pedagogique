import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User, UserModel } from './user.types'
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

export class UserController{

    public addNewUser (req: Request, res: Response) {                
        let newUser = new UserModel(req.body);
        newUser.password = bcrypt.hashSync(newUser.password, 10);
    
        newUser.save((err, user) => {
            if(err){
                res.send(err);
            }
            user.password = null;
            res.json(user);
        });
    }

    public getUsers (req: Request, res: Response) {           
        UserModel.find({}, (err, user) => {
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }

    public getUserWithID (req: Request, res: Response) {
        console.log(req.params._id);           
        UserModel.findById(req.params._id, (err, user) => {
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }

    public updateUser (req: Request, res: Response) {
        UserModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, user) => {
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }

    public deleteUser (req: Request, res: Response) {           
        UserModel.remove({ _id: req.params._id }, (err) => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted User!'});
        });
    }

    public authenticate (req: Request, res: Response) {           
        UserModel.findOne({ username: req.body.username }, (err, user: User) => {
            if(err){
                res.send({ message : "Unable to authenticate user"});
                return;
            }
            if(!bcrypt.compareSync(req.body.password, user.password)) {
                res.send({ message : "Unable to authenticate user"});
                return;
            }
            res.set('Authorization', jwt.sign({_id : user._id}, 'SECRET')).send(user);
        });
    }
    
}