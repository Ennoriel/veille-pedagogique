/**
 * Classe d'un utilisateur
 */
export class User {
    constructor(){
        this._id;
        this.username = '';
        this.lastname = '';
        this.firstname = '';
        this.email = '';
        this.password = '';
        this.passwordBis = '';
    }

    _id: string;
    username: string;
    lastname: string;
    firstname: string;
    email: string;
    password: string;
    passwordBis: string;
}

export const SAVE_USER_DATA = 'SAVE_USER_DATA';
export type SAVE_USER_DATA = typeof SAVE_USER_DATA;

export interface UserState {
    user: User,
    token: string
}

export enum UserRight {
    NOT_AUTH,
    BEARER
}

export const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/