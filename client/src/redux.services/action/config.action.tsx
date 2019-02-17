export const INCREMENT_ARTICLE_PAGE = 'INCREMENT_ARTICLE_PAGE';
export type INCREMENT_ARTICLE_PAGE = typeof INCREMENT_ARTICLE_PAGE;

export const RESET_ARTICLE_PAGE = 'RESET_ARTICLE_PAGE';
export type RESET_ARTICLE_PAGE = typeof RESET_ARTICLE_PAGE;

/**
 * Objet permettant d'incrémenter le numéro de la page dans le store
 */
export interface incrementArticlePageAction {
    type: INCREMENT_ARTICLE_PAGE,
}

/**
 * Objet permettant de remettre à zéro le numéro de la page dans le store
 */
export interface resetArticlePageAction {
    type: RESET_ARTICLE_PAGE,
}

/**
 * Génère un objet permettant d'incrémenter le numéro de la page dans le store
 */
export function IncrementArticlePage(): incrementArticlePageAction {
    return {
        type: INCREMENT_ARTICLE_PAGE
    }
}

/**
 * Génère un objet permettant de remettre à zéro le numéro de la page dans le store
 */
export function ResetArticlePage(): resetArticlePageAction {
    return {
        type: RESET_ARTICLE_PAGE
    }
}