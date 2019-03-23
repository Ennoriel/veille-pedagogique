import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes as ArticleRoutes } from "./article/article.routes";
import { Routes as UserRoutes } from "./user/user.routes";
import * as mongoose from "mongoose";
import { AuthorizationService } from "./config/authorization.service";
import { CorsService } from "./config/cors.service";
import * as path from "path";

const BASE_URI = '/api';

/**
 * Serveur de l'application
 */
class Server {

    public app: express.Application;

    public authorizationSerivce: AuthorizationService = new AuthorizationService();
    public corsService: CorsService = new CorsService();

    public articleRoute: ArticleRoutes = new ArticleRoutes();
    public userRoute: UserRoutes = new UserRoutes();

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

        this.app.use(this.corsService.corsConfig);

        this.app.use(this.authorizationSerivce.jwtFilter);


        this.app.use(express.static(path.join(__dirname, '/../client/build')));
        
        this.app.use(BASE_URI, this.articleRoute.routes);
        this.app.use(BASE_URI, this.userRoute.routes);

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '/../client/build/index.html'));
        });
    }

    /**
     * Configuration du client de gestion de base de données
     */
    private dbConfig(): void {
        (<any>mongoose).Promise = global.Promise;

        let conf = require('./credentials.json')["mongodb"];
        let mongoUrl = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + conf["db"]
    
        mongoose.connect(mongoUrl, { useNewUrlParser: true });        
    }

    /**
     * Lancement du serveur
     */
    private serveurLaunch(): void {
        this.app.listen(process.env.PORT || 3001, () => {});
    }

}

export default new Server().app;