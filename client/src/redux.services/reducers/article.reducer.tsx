import { articleState } from '../constants/article.types';
import { SaveArticleAction, LOAD_ARTICLE } from '../action/article.action';

import * as _ from "lodash";

export default (state: articleState = {}, action: SaveArticleAction) => {
    switch(action.type) {
        case LOAD_ARTICLE:
            return {..._.values(state).concat(action.payload.articles)};
    }
    return state;
};