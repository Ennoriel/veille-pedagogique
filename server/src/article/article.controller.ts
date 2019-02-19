import { Request, Response } from 'express';
import { ArticleModel } from './article.types'
import {
    addRegexParam,
    addRegexParams,
    addRegexParamsOrEmpty,
    addAfterParam,
    addBooleanParam
} from './../shared/searchObject.util';

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
        addRegexParamsOrEmpty(queryParam, 'medium', req.query.medium === '{}' ? null : req.query.medium);
        addRegexParam(queryParam, 'siteInternet', req.query.siteInternet);
        addAfterParam(queryParam, 'createdAt', req.query.createdAt);
        addRegexParams(queryParam, 'themes', req.query.themes);
        addBooleanParam(queryParam, 'isVisible', false, false);

        console.log("");
        console.log("");
        console.log("");
        console.log("URL QUERY");
        console.log(req.query);
        console.log("MONGO QUERY");
        console.log(queryParam);

        ArticleModel
                .find(queryParam)
                .limit(perPage)
                .skip(perPage * page)
                .sort({"indexedAt": "desc"})
                .exec((err, article) => {
                    
            if(err){
                res.status(400).send(err);
                return;
            }
            res.json(article);
        });
    }

    public getArticleWithID = (req: Request, res: Response) => {
        this.getArticleById(req.params._id, res)
    }

    public getArticleById (id: string, res: Response) {
        ArticleModel.findById(id, (err, article) => {
            if(err){
                res.send(err);
            }
            res.json(article);
        });
    }

    public updateArticle = (req: Request, res: Response) => {

        let article = req.body.params;
        if(article._id) {
            delete article._id;
        }console.log(article);
        
        ArticleModel.findOneAndReplace({ _id: req.params._id }, article, (err, article) => {
            if(err){
                res.send(err);
            }
            this.getArticleById(req.params._id, res);
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