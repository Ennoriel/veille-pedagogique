/**
 * Classe d'un utilisateur
 */
export class User {
    constructor(){
        this._id;
        this.username = '';
        this.lastname = '';
        this.firstname = '';
        this.password = '';
        this.passwordBis = '';
    }

    _id: string;
    username: string;
    lastname: string;
    firstname: string;
    password: string;
    passwordBis: string;
}