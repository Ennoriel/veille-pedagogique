import { INCREMENT_ARTICLE_PAGE, incrementArticlePageAction } from "../action/config.action";

export default (state = {"articlePage":0}, action: incrementArticlePageAction) => {
    switch(action.type) {
        case INCREMENT_ARTICLE_PAGE:
            return {articlePage: state.articlePage + 1};
    }
    return state;
};