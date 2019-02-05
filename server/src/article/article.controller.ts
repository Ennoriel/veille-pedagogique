import { Request, Response } from 'express';
import { ArticleModel } from './article.types'
import { addRegexParam, addRegexParams, addAfterParam } from './../shared/searchObject.util';

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

        let perPage = 5;
        let page = Math.min(10, Math.max(0, parseInt(req.query.page)));

        let queryParam = {};
        addRegexParam(queryParam, 'title', req.query.title);
        // TODO remplacer les espaces de la description par des | en regex
        addRegexParam(queryParam, 'description', req.query.description);
        addRegexParam(queryParam, 'medium', req.query.medium);
        addRegexParam(queryParam, 'siteInternet', req.query.siteInternet);
        addAfterParam(queryParam, 'createdAt', req.query.createdAt);
        addRegexParams(queryParam, 'themes', req.query.themes);

        ArticleModel
                .find(queryParam)
                .limit(perPage)
                .skip(perPage * page)
                .sort({"indexedAt": "desc"})
                .exec((err, article) => {
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

    public getThemes (req: Request, res: Response) {
        ArticleModel.distinct('themes')
                .exec((err, themes) => {
            if(err){
                res.send(err);
            }
            res.json(themes);
        });
    }
    
}