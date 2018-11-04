import { createStore, combineReducers } from "redux";

import user from "./reducers/user.reducer";
import enthusiasm from "./reducers/enthusiasm.reducer";

const store = createStore(
    combineReducers(
        {
            user,
            enthusiasm
        }
    )
);

export default store;