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