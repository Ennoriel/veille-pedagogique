export interface IUser{

    _id?: string;
    username?: string;
    lastname?: string;
    firstname?: string;
    email?: string;
    password?: string;
    passwordBis?: string;
    right?: UserRight;
    token?: string;
}

/**
 * Classe d'un utilisateur
 */
export class User implements IUser{
    constructor(){
        this._id;
        this.username = '';
        this.lastname = '';
        this.firstname = '';
        this.email = '';
        this.password = '';
        this.passwordBis = '';
        this.right = UserRight.NOT_AUTH;
    }

    _id: string;
    username: string;
    lastname: string;
    firstname: string;
    email: string;
    password: string;
    passwordBis: string;
    right: UserRight;
}

export const SAVE_USER_DATA = 'SAVE_USER_DATA';
export type SAVE_USER_DATA = typeof SAVE_USER_DATA;

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export interface UserState {
    user: User,
    token: string
}

export enum UserRight {
    NOT_AUTH = "NOT_AUTH",
    BEARER_FREE = "BEARER_FREE",
    BEARER_PREMIUM = "BEARER_PREMIUM",
    SUPER_USER = "SUPER_USER"
}

export const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/