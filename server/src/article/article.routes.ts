import * as express from "express";

import { ArticleController } from "./article.controller";

export class Routes { 
    
    public articleController: ArticleController = new ArticleController();
    
    get routes(): express.Router {
        
        let router = express.Router();

        // Article
        router.route('/article')
        .get(this.articleController.getArticles)        

        // POST endpoint
        .post(this.articleController.addNewArticle);

        // Article detail
        router.route('/article/:_id')
        // get specific article
        .get(this.articleController.getArticleWithID)
        .put(this.articleController.updateArticle)
        .delete(this.articleController.deleteArticle);

        router.route('/theme')
        .get(this.articleController.getThemes);

        return router;
    }
}