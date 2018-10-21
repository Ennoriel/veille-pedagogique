import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');

/**
 * Service d'autorisation
 */
export class AuthorizationService {

    /**
     * filtre permettant de laisse passer un appel webservice d'un utilisateur habilité.
     * i.e. appel webservice avec un jeton JWT valide,
     * sauf pour les webservice d'autentification et de création de compte
     * 
     * @param req requête
     * @param res réponse
     * @param next fonction next()
     */
    public jwtFilter(req: Request, res: Response, next: NextFunction) {
        if(req.url === '/authenticate' && (req.method === 'POST' || req.method === 'OPTIONS') ||
            req.url === '/user' && (req.method === 'POST' || req.method === 'OPTIONS')) {
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
    };
}