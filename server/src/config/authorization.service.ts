import { Request, Response, NextFunction } from "express";
import { UserController } from "./../user/user.controller";
var jwt = require('jsonwebtoken');

/**
 * Service d'autorisation
 */
export class AuthorizationService {

    public userController: UserController = new UserController();

    /**
     * filtre permettant de laisser passer un appel webservice d'un utilisateur habilité.
     * i.e. appel webservice avec un jeton JWT valide,
     * sauf pour les webservice d'autentification et de création de compte
     * 
     * @param req requête
     * @param res réponse
     * @param next fonction next()
     */
    public jwtFilter = (req: Request, res: Response, next: NextFunction) => {

        this.isTokenOk(req, res).then(isTokenOk => {
            if (isTokenOk) {
                next();
            } else {
                res.status(400).send({message: 'you shall not pass!'});
            }
        })
    }

    /**
     * Méthode de vérification des différents contrôles de validité du jeton
     * @param req requête
     * @param res réponse
     */
    private isTokenOk = async (req: Request, res: Response) => {

        const encodedToken = req.get('Authorization');
        let isTokenOk;

        if(this.isAuthorizedWithoutToken(req.method, req.url)) {
            console.log("1")
            isTokenOk = true;
        } else if (!this.isTokenPresent(encodedToken)) {
            console.log("2")
            isTokenOk = false;
        } else if (!this.isTokenPreserved(encodedToken)) {
            console.log("3")
            isTokenOk = false;
        } else if (await this.isTokenInUse(encodedToken)) {
            console.log("4")
            isTokenOk = false;
        } else {
            console.log("5")
            isTokenOk = true;
        }
        return isTokenOk;
    }

    /**
     * Méthode de vérification de nullité du jeton
     * @param encodedToken jeton
     */
    private isTokenPresent(encodedToken: string): any {
        return encodedToken !== null
    }

    /**
     * Méthode de vérification de la non altération du jeton
     * jwt.verify() throws an exception if the token is ivalid
     * @param encodedToken jeton
     */
    private isTokenPreserved(encodedToken: string): any {
        try {
            jwt.verify(encodedToken, 'SECRET');
            return true;
        } catch(e) {
            return false;
        }
    }

    /**
     * Méthode de vérification de l'appartenance du jeton à un utilisateur
     * @param encodedToken jeton
     */
    private isTokenInUse(encodedToken: string): any {
        const clearToken = jwt.decode(encodedToken);
        this.userController.existsUserById(clearToken._id).then(user => {
            if (!user) {
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * Vérification de l'appel selon l'URL d'appel au server
     * @param method méthode d'appel au serveur
     * @param url url d'appel au server
     */
    private isAuthorizedWithoutToken = (method: string, url: string) => {

        const map: Map<string, Array<RegExp>> = new Map();

        const regExpUrlGet = [/^\/user\/exists\/.*/];
        const regExpUrlPost = [/^\/authenticate$/, /^\/user$/];
        const REGEXP_EVERYTHING = [/.*/];

        map.set('GET', regExpUrlGet);
        map.set('OPTIONS', REGEXP_EVERYTHING);
        map.set('POST', regExpUrlPost);

        return map.get(method) != null && map.get(method).filter(regexUrl => url.match(regexUrl)).length > 0;
    }
}

interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    values(): IterableIterator<V>;
    [Symbol.iterator]():IterableIterator<[K,V]>;
    [Symbol.toStringTag]: string;
}

interface MapConstructor {
    new <K, V>(): Map<K, V>;
    new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
    prototype: Map<any, any>;
}
declare var Map: MapConstructor;