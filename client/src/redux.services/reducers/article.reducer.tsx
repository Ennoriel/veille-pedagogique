import { articleState } from '../constants/article.types';
import {
    LOAD_ARTICLE,
    REPLACE_ARTICLE,
    ArticleAction,
    REMOVE_ARTICLE
} from '../action/article.action';

import * as _ from "lodash";

export default (state: articleState = {}, action: ArticleAction) => {
    switch(action.type) {
        case LOAD_ARTICLE:
            return {..._.values(state).concat(action.payload.articles)};
        case REPLACE_ARTICLE:
            return action.payload.articles;
        case REMOVE_ARTICLE:
            let articles = _.values(Object.assign({}, state));
            articles.splice(action.payload.articleKey, 1);
            return {...articles};
    }
    return state;
};