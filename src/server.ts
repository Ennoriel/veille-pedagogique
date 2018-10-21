import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes as ArticleRoutes } from "./article/article.routes";
import { Routes as UserRoutes } from "./user/user.routes";
import * as mongoose from "mongoose";
import { AuthorizationService } from "./config/authorization.service";

/**
 * Serveur de l'application
 */
class Server {

    public app: express.Application;
    public authorizationSerivce: AuthorizationService = new AuthorizationService();
    public articleRoute: ArticleRoutes = new ArticleRoutes();
    public userRoute: UserRoutes = new UserRoutes();

    public mongoUrl: string = 'mongodb://veille-pedago-dc8ab820:529269fb1459@ds117158.mlab.com:17158/veille-pedago';

    /**
     * Initialisation du contexte du serveur
     */
    constructor() {

        this.serverConfig();
        this.dbConfig();
        this.serveurLaunch();

    }

    /**
     * Configuration du serveur
     */
    private serverConfig(): void {

        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static('public'));

        this.app.use(this.authorizationSerivce.jwtFilter);

        this.articleRoute.routes(this.app);
        this.userRoute.routes(this.app);
    }

    /**
     * Configuration du client de gestion de base de données
     */
    private dbConfig(): void {
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(this.mongoUrl);        
    }

    /**
     * Lancement du serveur
     */
    private serveurLaunch(): void {
        this.app.listen(3001, () => {
            console.log(`Listening at http://localhost:${3001}/`);
        });
    }

}

export default new Server().app;