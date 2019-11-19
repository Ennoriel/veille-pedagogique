export interface articleState {
    [key:string]: ArticleItem
}

export interface ArticleItem {
    _id: string,
    isVisible?: boolean
    title: string,
    url: string,
    language: string,
    medium: string,
    topImage: string,
    createdAt: number,
    approvedAt: number,
    indexedAt: number,
    description: string,
    themes: Array<string>
    siteInternet: string,
    auteur: Array<number>,
    tweetId?: Array<number>
}

export interface IArticleCritere extends IRecherche {
    title?: string,
    description?: string,
    medium?: Array<string>,
    siteInternet?: string,
    createdAt?: number,
    themes?: Array<string>
}

export class ArticleCritere implements IArticleCritere {
    constructor() {
        this.page = 0;
        this.title = '';
        this.description = '';
        this.medium = ['video', 'blog', 'presse'];
        this.siteInternet = '';
        this.createdAt;
        this.themes = [];
    }

    page: number;
    title?: string;
    description?: string;
    medium?: Array<string>;
    siteInternet?: string;
    createdAt?: number;
    themes?: Array<string>;
}