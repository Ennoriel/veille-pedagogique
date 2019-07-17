export interface ThemeGraphItem {
    themeNodes: Array<nodeGraphItem>,
    themeLinks: linkGraphItem,
    wieght: number
}

export interface nodeGraphItem {
    id: String,
    label: String,
    radius: number
}

export interface linkGraphItem {
    source: String,
    target: String,
    value: number
}
