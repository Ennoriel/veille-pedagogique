import { ArticleItem } from "../constants/article.types";

export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export type LOAD_ARTICLE = typeof LOAD_ARTICLE;

export const REPLACE_ARTICLE = 'REPLACE_ARTICLE';
export type REPLACE_ARTICLE = typeof REPLACE_ARTICLE;

/**
 * Objet permettant de sauvegarder des articles dans le store
 */
export interface SaveArticleAction {
    type: LOAD_ARTICLE,
    payload: {
        articles: Array<ArticleItem>
    };
}

/**
 * Objet permettant de remplacer des articles dans le store (dans le cas d'une nouvelle recherche)
 */
export interface ReplaceArticleAction {
    type: REPLACE_ARTICLE,
    payload: {
        articles: Array<ArticleItem>
    };
}

/**
 * Génère un objet permettant de sauvegarder des articles dans le store
 * @param articles articles à sauvegarder dans le store
 */
export function SaveArticles(articles: Array<ArticleItem>): SaveArticleAction {
    return {
        type: LOAD_ARTICLE,
        payload: {
            articles
        }
    }
}

/**
 * Génère un objet permettant de remplacer des articles
 * dans le store (dans le cas d'une nouvelle recherche)
 * @param articles articles à sauvegarder dans le store
 */
export function ReplaceArticles(articles: Array<ArticleItem>): ReplaceArticleAction {
    return {
        type: REPLACE_ARTICLE,
        payload: {
            articles
        }
    }
}