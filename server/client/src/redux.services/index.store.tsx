import {
    createStore
} from "redux";

import user from "./reducers/user.reducer";
import route from "./reducers/route.reducer";
import article from "./reducers/article.reducer";
import auteur from "./reducers/auteur.reducer";
import config, { configState } from "./reducers/config.reducer";

import {
    persistStore
    persistCombineReducers
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { IUser } from "src/user/User.types";
import { RouteState } from "./constants/route.types";
import { articleState } from "./constants/article.types";
import { auteurState } from "./constants/auteur.types";

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ["route", "article", "auteur", "config"]
}

const reducers = {
    user: user,
    route: route,
    article: article,
    auteur: auteur,
    config: config
}

type reducerType = {
    user: IUser,
    route: RouteState,
    article: articleState,
    auteur: auteurState,
    config: configState
}

const persistedReducers = persistCombineReducers<reducerType>(persistConfig, reducers);

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}

export const store = createStore(persistedReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store, undefined, () => store.getState());
