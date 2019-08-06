import {
    INCREMENT_ARTICLE_PAGE,
    RESET_ARTICLE_PAGE,
    incrementArticlePageAction,
    resetArticlePageAction
} from "../action/config.action";

let DEFAULT_ARTICLE_PAGE = {'articlePage': 0}

export interface configState {
    articlePage: number
}

export default (state = DEFAULT_ARTICLE_PAGE, action: incrementArticlePageAction | resetArticlePageAction) => {
    switch(action.type) {
        case INCREMENT_ARTICLE_PAGE:
            return {articlePage: state.articlePage + 1};
        case RESET_ARTICLE_PAGE:
            return DEFAULT_ARTICLE_PAGE;
    }
    return state;
};