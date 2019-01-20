import { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { ArticleController } from "./article.controller";

export class Routes { 
    
    public articleController: ArticleController = new ArticleController();
    
    public routes(app: Application): void {
        
        // Article
        app.route('/article')
        .get(this.articleController.getArticles)        

        // POST endpoint
        .post(this.articleController.addNewArticle);

        // Article detail
        app.route('/article/:_id')
        // get specific article
        .get(this.articleController.getArticleWithID)
        .put(this.articleController.updateArticle)
        .delete(this.articleController.deleteArticle)

    }
}