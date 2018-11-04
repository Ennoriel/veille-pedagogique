import { createStore, combineReducers } from "redux";

import user from "./reducers/user.reducer";
import enthusiasm from "./reducers/enthusiasm.reducer";
import article from "./reducers/article.reducer";
import auteur from "./reducers/auteur.reducer";

const store = createStore(
    combineReducers(
        {
            user,
            enthusiasm,
            article,
            auteur
        }
    )
);

export default store;