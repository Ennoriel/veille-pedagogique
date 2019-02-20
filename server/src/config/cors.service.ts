import { Request, Response, NextFunction } from "express";

/**
 * Service d'autorisation
 */
export class CorsService {

    /**
     * configuration CORS
     * 
     * @param req requête
     * @param res réponse
     * @param next fonction next()
     */
    public corsConfig (req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
        res.header("Access-Control-Allow-Methods", "PUT, DELETE");
        res.header("Access-Control-Expose-Headers", "Authorization");
        next();
    };
}