export interface articleState {
    [key:string]: ArticleItem
}

export interface ArticleItem {
    title: string,
    url: string,
    language: string,
    medium: string,
    createdAt: number,
    indexedAt: number,
    description: string,
    themes: Array<string>
    siteInternet: string,
    auteur: Array<number>,
    tweetId?: Array<number>
}

export interface IArticleCritere {
    title: string,
    description: string,
    medium: {[key: string]: string},
    siteInternet: string,
    createdAt: number,
    themes: Array<string>
}

export class ArticleCritere implements IArticleCritere {
    constructor() {
        this.title;
        this.description;
        this.medium = {
            // video : '',
            // blog : '',
            // presse : ''
        };
        this.siteInternet;
        this.createdAt;
        this.themes;
    }

    title: string;
    description: string;
    medium: {[key: string]: string};
    siteInternet: string;
    createdAt: number;
    themes: Array<string>;
}