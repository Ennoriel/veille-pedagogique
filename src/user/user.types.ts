var mongoose = require('mongoose');
require('mongoose-type-email');

var Schema = mongoose.Schema;

/**
 * Classe d'un utilisateur
 */
export class User {
    constructor(){}

    _id: string;
    username: string;
    lastname: string;
    firstname: string;
    email: string;
    password: string;
}

/**
 * Schéma d'un utilisateur
 */
var userSchema = new Schema({

    username: {type: String, unique: true, require},
    lastname: String,
    firstname: String,
    email: {type: mongoose.SchemaTypes.Email, unique: true, require},
    password: String

});

/**
 * Modèle d'un utilisateur
 */
export var UserModel = mongoose.model('User', userSchema);