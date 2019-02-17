import { articleState } from '../constants/article.types';
import {
    SaveArticleAction,
    LOAD_ARTICLE,
    REPLACE_ARTICLE,
    ReplaceArticleAction
} from '../action/article.action';

import * as _ from "lodash";

export default (state: articleState = {}, action: SaveArticleAction | ReplaceArticleAction) => {
    switch(action.type) {
        case LOAD_ARTICLE:
            return {..._.values(state).concat(action.payload.articles)};
        case REPLACE_ARTICLE:
            return action.payload.articles;
    }
    return state;
};