export interface HashtagItem {
    _id: string,
    entry: string,
    articleToBeDeleted: boolean,
    themeToBeDeleted: boolean,
    associatedThemes: Array<string>,
    saved?: boolean
}
