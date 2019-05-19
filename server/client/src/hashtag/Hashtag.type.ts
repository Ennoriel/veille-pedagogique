export interface HashtagItem {
    _id: string,
    entry: string,
    articleToBeDeleted: boolean,
    themeToBeDeleted: boolean,
    synonyme: string,
    saved?: boolean
}
