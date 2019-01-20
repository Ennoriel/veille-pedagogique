import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');

/**
 * Service d'autorisation
 */
export class AuthorizationService {

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

        if(this.isAuthorizedWithoutToken(req.method, req.url)) {
            console.log('no JWT Token verification');
            next();
        } else {
            let token = req.get('Authorization');
            if(token == null || !jwt.verify(token, 'SECRET')) {
                res.status(400).send({message: 'you shall not pass!'});
            } else {
                next();
            }
        }
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