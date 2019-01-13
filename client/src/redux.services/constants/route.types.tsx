export const SAVE_ACTIVE_ROUTE = 'SAVE_ACTIVE_ROUTE';
export type SAVE_ACTIVE_ROUTE = typeof SAVE_ACTIVE_ROUTE;

export interface RouteState {
    path: string,
    label: string,
    component?: new (props: any) => React.Component
}
