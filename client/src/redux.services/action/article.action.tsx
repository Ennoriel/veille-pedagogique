import { ArticleItem } from "../constants/article.types";

export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export type LOAD_ARTICLE = typeof LOAD_ARTICLE;

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