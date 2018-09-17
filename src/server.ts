import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes as ArticleRoutes } from "./article/article.routes";
import { Routes as UserRoutes } from "./user/user.routes";
import * as mongoose from "mongoose";
import { networkInterfaces } from "os";
var jwt = require('jsonwebtoken');

class Server {

    public app: express.Application;
    public articleRoute: ArticleRoutes = new ArticleRoutes();
    public userRoute: UserRoutes = new UserRoutes();

    public mongoUrl: string = 'mongodb://veille-pedago-dc8ab820:529269fb1459@ds117158.mlab.com:17158/veille-pedago';

    constructor() {
        this.app = express();
        this.config();
        this.articleRoute.routes(this.app);
        this.userRoute.routes(this.app);
        this.mongoSetup();

        this.app.listen(3001, () => {
            // Success callback
            console.log(`Listening at http://localhost:${3001}/`);
        });
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(express.static('public'));

        this.app.use((req, res, next) => {
            if(req.url === '/authenticate' && req.method === 'POST' ||
                req.url === '/user' && req.method === 'POST') {
                    next();
            } else {
                let token = req.get('Authorization');
                console.log(token);
                if(token == null || !jwt.verify(token, 'SECRET')) {
                    res.status(400).send({message: 'you shall not pass!'});
                } else {
                    next();
                }
            }
        });
    }

    private mongoSetup(): void{
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(this.mongoUrl);        
    }

}

export default new Server().app;