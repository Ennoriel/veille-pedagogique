import * as constants from '../constants/route.types'

export interface SaveActiveRoute {
    type: constants.SAVE_ACTIVE_ROUTE,
    payload: constants.RouteState
}

export function saveActiveRoute(route: constants.RouteState): SaveActiveRoute {
    return {
        type: constants.SAVE_ACTIVE_ROUTE,
        payload: {
            path: route.path,
            label: route.label
        }
    }
}