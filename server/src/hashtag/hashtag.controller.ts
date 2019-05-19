import { Request, Response } from 'express';
import { HashtagModel } from './hashtag.types';
import { ArticleModel } from './../article/article.types';
import { ThemeModel } from './../theme/theme.types';

export class HashtagController {

    /**
     * Retrieve not yet indexed hashtags for a super user to index them
     */
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

    /**
     * Update an hashtag to a theme
     */
    public updateHashtagToTheme = async (req: Request, res: Response) => {

        let hashtag = req.body;

        if(hashtag._id) {
            delete hashtag._id;
        }

        if(hashtag.associatedThemes.length) {
            hashtag.associatedThemes = hashtag.associatedThemes.split(";")
        }
        
        let articlesBeforeUpdatePromise = await this.getArticlesBeforeUpdate(hashtag)

        this.updateHashtag(req.params._id, hashtag);

        const hasNewThemes = await this.updateArticles(hashtag);
        
        if (hasNewThemes) {
            await this.updateThemes(hashtag, articlesBeforeUpdatePromise);
        }

        res.status(200).send();
    }

    /**
     * Retrieve the articles before the theme update
     * @param hashtag hashtag to be modified
     */
    async getArticlesBeforeUpdate(hashtag: any) {
        
        const articleQuery = {
            "notYetIndexedThemes": {
                "$all": [hashtag.entry]
            }
        };

        return await ArticleModel.find(articleQuery, (err, articles) => {
            return articles;
        })
        
    }

    /**
     * Update all the themes related to the themes updated
     * @param hashtag hastag to be modified
     * @param articles articles before beeing updated
     */
    public updateThemes (hashtag: any, articles) {

        const hashtagThemes = hashtag.associatedThemes;

        articles.forEach(async article => {

            let oldArticleThemes = article.themes;
            oldArticleThemes = oldArticleThemes.filter(item => {
                return !hashtagThemes.includes(item)
            })

            for (const oldTheme of oldArticleThemes) {
                for (const newTheme of hashtagThemes) {
                    this.updateTheme(oldTheme, newTheme);
                    this.updateTheme(newTheme, oldTheme);
                }
            }
        });
    }

    /**
     * Update two themes, i.e. increase weight by one for both direction (A -> B | B -> A)
     * @param themeA first theme
     * @param themeB second theme
     */
    private async updateTheme(themeA, themeB) {

        let res = await ThemeModel.updateOne({
            "theme": themeA,
            "neighboors.node": themeB
        }, {
            "$inc": {
                "neighboors.$.weight": 1
            }
        }).exec();

        if (res.nModified == 0) {
            await ThemeModel.updateOne({
                "theme": themeA
            }, {
                    "$push": {
                        "neighboors": {
                            "node": themeB,
                            "weight": 1
                        }
                    }
                }, {
                    "upsert": true
                }).exec();
        }
    }

    /**
     * Update the hashtag
     * @param _id identifiant
     * @param hashtag hashtag to be updated
     */
    public updateHashtag (_id: number, hashtag: any) {

        HashtagModel.findOneAndReplace({ _id: _id }, hashtag)
                    .exec()
                    .then(() => {});

    }

    /**
     * Update the articles
     * @param hashtag hashtag to be updated
     */
    public async updateArticles (hashtag) {

        const articleQuery = {
            "notYetIndexedThemes": {
                "$all": [hashtag.entry]
            }
        };

        let hasNewThemes = false;

        if (hashtag.articleToBeDeleted) {

            await ArticleModel.updateMany(
                articleQuery,
                {
                    "$set": {
                        "isVisible": false
                    }
                }
                ,()=>{}
            );
            
        } else if (hashtag.themeToBeDeleted) {

            ArticleModel.updateMany(
                articleQuery,
                {
                    "$pull": {
                        "notYetIndexedThemes": hashtag.entry
                    }
                }
            ).exec().then(()=>{});

        } else {
            
            ArticleModel.updateMany(
                articleQuery,
                {
                    "$pull": {
                        "notYetIndexedThemes": hashtag.entry
                    },
                    "$push": {
                        "themes": hashtag.associatedThemes
                    }
                }
            ).exec().then(()=>{});

            hasNewThemes = true;
        }

        return hasNewThemes;
    }
}