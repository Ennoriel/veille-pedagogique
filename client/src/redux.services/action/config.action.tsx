export const INCREMENT_ARTICLE_PAGE = 'INCREMENT_ARTICLE_PAGE';
export type INCREMENT_ARTICLE_PAGE = typeof INCREMENT_ARTICLE_PAGE;

/**
 * Objet permettant d'incrémenter le numéro de la page dans le store
 */
export interface incrementArticlePageAction {
    type: INCREMENT_ARTICLE_PAGE,
}

/**
 * Génère un objet permettant d'incrémenter le numéro de la page dans le store
 */
export function IncrementArticlePage(): incrementArticlePageAction {
    return {
        type: INCREMENT_ARTICLE_PAGE
    }
}