import { ArticleItem } from "../constants/article.types";

export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export type LOAD_ARTICLE = typeof LOAD_ARTICLE;

export const REPLACE_ALL_ARTICLES = 'REPLACE_ALL_ARTICLES';
export type REPLACE_ALL_ARTICLES = typeof REPLACE_ALL_ARTICLES;

export const REPLACE_ARTICLE = 'REPLACE_ARTICLE';
export type REPLACE_ARTICLE = typeof REPLACE_ARTICLE;

export const REMOVE_ARTICLE = 'REMOVE_ARTICLE';
export type REMOVE_ARTICLE = typeof REMOVE_ARTICLE;


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
export interface ReplaceAllArticlesAction {
    type: REPLACE_ALL_ARTICLES,
    payload: {
        articles: Array<ArticleItem>
    };
}

/**
 * Objet permettant de remplacer un article dans le store (dans le cas d'une mise à jour)
 */
export interface ReplaceArticleAction {
    type: REPLACE_ARTICLE,
    payload: {
        index: number,
        article: ArticleItem
    };
}

/**
 * Objet permettant de supprimer un article dans le store (par le super user)
 */
export interface RemoveArticleAction {
    type: REMOVE_ARTICLE,
    payload: {
        index: number
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
export function ReplaceAllArticles(articles: Array<ArticleItem>): ReplaceAllArticlesAction {
    return {
        type: REPLACE_ALL_ARTICLES,
        payload: {
            articles
        }
    }
}

/**
 * Génère un objet permettant de remplacer un article
 * dans le store (dans le cas d'une mise à jour)
 * @param index index de l'article à modifier
 * @param articles article à sauvegarder dans le store
 */
export function ReplaceArticle(index: number, article: ArticleItem): ReplaceArticleAction {
    return {
        type: REPLACE_ARTICLE,
        payload: {
            index,
            article
        }
    }
}

/**
 * Génère un objet permettant de remplacer des articles
 * dans le store (dans le cas d'une nouvelle recherche)
 * @param articles articles à sauvegarder dans le store
 */
export function RemoveArticle(index: number): RemoveArticleAction {
    return {
        type: REMOVE_ARTICLE,
        payload: {
            index
        }
    }
}

export type ArticleAction = SaveArticleAction | ReplaceAllArticlesAction | ReplaceArticleAction | RemoveArticleAction;