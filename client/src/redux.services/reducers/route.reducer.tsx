import { SAVE_ACTIVE_ROUTE, RouteState } from "../constants/route.types";
import { SaveActiveRoute } from "../action/route.action";
import { LOGOUT } from "src/user/User.types";
import { Logout } from "../action/user.action";

export const DEFAULT_ROUTE = {
    path: '/home',
    label: 'Home',
}

export default (state: RouteState = DEFAULT_ROUTE, action: SaveActiveRoute | Logout) => {
    switch(action.type) {
        case SAVE_ACTIVE_ROUTE:
            return action.payload as RouteState;
        case LOGOUT:
            return DEFAULT_ROUTE;
    }
    return state;
}