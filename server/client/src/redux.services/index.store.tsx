import { createStore, combineReducers } from "redux";

import user from "./reducers/user.reducer";
import route from "./reducers/route.reducer";
import article from "./reducers/article.reducer";
import auteur from "./reducers/auteur.reducer";
import config from "./reducers/config.reducer";

const store = createStore(
    combineReducers(
        {
            user,
            route,
            article,
            auteur,
            config
        }
    )
);

export default store;