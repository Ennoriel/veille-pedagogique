export interface articleState {
    [key:string]: ArticleItem
}

export interface ArticleItem {
    title: string,
    url: string,
    language: string,
    medium: string,
    date: Date,
    description: string,
    themes: Array<string>
    siteInternet: string,
    auteur: number
}