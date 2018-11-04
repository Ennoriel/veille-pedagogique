export interface articleState {
    [key:string]: {
        title: string,
        url: string,
        language: string,
        medium: string,
        date: Date,
        theme: Array<string>
        siteInternet: string,
        auteur: number
    }
}