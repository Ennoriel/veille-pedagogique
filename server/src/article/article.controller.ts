import { Request, Response } from 'express';
import { ArticleModel } from './article.types'

export class ArticleController{

    public addNewArticle (req: Request, res: Response) {                
        let newArticle = new ArticleModel(req.body);
    
        newArticle.save((err, article) => {
            if(err){
                res.send(err);
            }    
            res.json(article);
        });
    }

    public getArticles (req: Request, res: Response) {           
        ArticleModel.find({}, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public getArticleWithID (req: Request, res: Response) {
        console.log(req.params._id);           
        ArticleModel.findById(req.params._id, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public updateArticle (req: Request, res: Response) {
        ArticleModel.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true }, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public deleteArticle (req: Request, res: Response) {           
        ArticleModel.remove({ _id: req.params._id }, (err) => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted Article!'});
        });
    }
    
}