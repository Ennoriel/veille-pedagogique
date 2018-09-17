var mongoose = require('mongoose');

var Schema = mongoose.Schema;

export class User {
    constructor(){}

    _id: string;
    username: string;
    lastname: string;
    firstname: string;
    password: string;
}

var userSchema = new Schema({

    username: {type: String, unique: true},
    lastname: String,
    firstname: String,
    password: String

});

userSchema.query.byTitre = function(titre: string) {
    return this.where({ titre: new RegExp(titre, 'i') });
};

export var UserModel = mongoose.model('User', userSchema);