import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { ArticleModel } from './article.types'

// const Article = mongoose.model('ArticleModel', ArticleSchema);

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
        // ArticleModel.findByTitle(req.query.titre, (err, article) => {
        //     console.log(article);
        //     if(err){
        //         res.send(err);
        //     }
        //     res.json(article);
        // });
    }

    public getArticleWithID (req: Request, res: Response) {
        console.log(req.params.articleId);           
        ArticleModel.findById(req.params.articleId, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public updateArticle (req: Request, res: Response) {
        console.log(req.params.articleId);
        console.log(req.body.lien);
        ArticleModel.findOneAndUpdate({ _id: req.params.articleId }, req.body, { new: true }, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public deleteArticle (req: Request, res: Response) {           
        ArticleModel.remove({ _id: req.params.articleId }, (err) => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted Article!'});
        });
    }
    
}