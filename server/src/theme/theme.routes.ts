import * as express from "express";

import { ThemeController } from "./theme.controller";

export class Routes { 
    
    public themeController: ThemeController = new ThemeController();
    
    get routes(): express.Router {
        
        let router = express.Router();

        router.route('/themeGraph/:theme')
                .get(this.themeController.getGraphThemes);

        return router;
    }
}