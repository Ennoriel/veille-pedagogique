import { SAVE_ACTIVE_ROUTE, RouteState } from "../constants/route.types";
import { SaveActiveRoute } from "../action/route.action";

let defaultRoute = {
    path: '/hello',
    label: 'Hello',
}

export default (state: RouteState = defaultRoute, action: SaveActiveRoute) => {
    console.log(action);
    switch(action.type) {
        case SAVE_ACTIVE_ROUTE:
            return action.payload;
    }
    return state;
}