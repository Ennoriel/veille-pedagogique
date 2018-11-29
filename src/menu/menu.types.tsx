export interface MenuRoute {
    path: string,
    label: string,
    component?: new (props: any) => React.Component
    icon?: any
}