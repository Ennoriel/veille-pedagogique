import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./article/article.routes";
import * as mongoose from "mongoose";

class Server {

    public app: express.Application;
    public routePrv: Routes = new Routes();

    public mongoUrl: string = 'mongodb://veille-pedago-dc8ab820:529269fb1459@ds117158.mlab.com:17158/veille-pedago';

    constructor() {
        this.app = express();
        this.config();        
        this.routePrv.routes(this.app);     
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
    }

    private mongoSetup(): void{
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(this.mongoUrl);        
    }

}

export default new Server().app;