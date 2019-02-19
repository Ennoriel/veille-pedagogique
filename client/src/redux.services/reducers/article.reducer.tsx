import { articleState } from '../constants/article.types';
import {
    LOAD_ARTICLE,
    REPLACE_ALL_ARTICLES,
    REPLACE_ARTICLE,
    ArticleAction,
    REMOVE_ARTICLE
} from '../action/article.action';

import * as _ from "lodash";

export default (state: articleState = {}, action: ArticleAction) => {

    let articles = _.values(Object.assign({}, state));

    switch(action.type) {
        case LOAD_ARTICLE:
            return {..._.values(state).concat(action.payload.articles)};
        case REPLACE_ALL_ARTICLES:
            return action.payload.articles;
        case REPLACE_ARTICLE:
            articles[action.payload.index] = action.payload.article;
            return {...articles};
        case REMOVE_ARTICLE:
            articles.splice(action.payload.index, 1);
            return {...articles};
    }
    return state;
};