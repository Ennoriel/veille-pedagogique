import { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { ArticleController } from "./article.controller";

export class Routes { 
    
    public articleController: ArticleController = new ArticleController();
    
    public routes(app: Application): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })
        
        // Article
        app.route('/article')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            console.log(`Request query: ${req.query}`);
            if(req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e'){
                res.status(401).send('You shall not pass!');
            } else {
                next();
            }                        
        }, this.articleController.getArticles)        

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