import { SAVE_ACTIVE_ROUTE, RouteState } from '../constants/route.types';

export interface SaveActiveRoute {
    type: SAVE_ACTIVE_ROUTE,
    payload?: RouteState
}

export function saveActiveRoute(route: RouteState): SaveActiveRoute {
    return {
        type: SAVE_ACTIVE_ROUTE,
        payload: {
            path: route.path,
            label: route.label
        }
    }
}