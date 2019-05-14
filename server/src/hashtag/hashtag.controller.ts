import { Request, Response } from 'express';
import { HashtagModel } from './hashtag.types';

export class HashtagController {

    public getNotYetIndexedHashtags (req: Request, res: Response) {

        const queryParam = {
            "articleToBeDeleted": false,
            "themeToBeDeleted": false,
            "associatedThemes": []
        }

        HashtagModel.find(queryParam)
                    .exec((err, hashtags) => {
                
            if(err){
                res.status(400).send(err);
                return;
            }

            res.json(hashtags);
        });

    }

    public updateHashtag (req: Request, res: Response) {

        let hashtag = req.body;

        if(hashtag._id) {
            delete hashtag._id;
        }

        if(hashtag.associatedThemes.length) {
            hashtag.associatedThemes = hashtag.associatedThemes.split(";")
        }
        
        HashtagModel.findOneAndReplace({ _id: req.params._id }, hashtag, (err, hashtag) => {
            if(err){
                res.send(err);
            }
            res.status(200).send();
        });
        // TODO mettre à jour les articles utilisant ce hashtag
        // TODO mettre à jour les poids des liens entre les thèmes
    }
}