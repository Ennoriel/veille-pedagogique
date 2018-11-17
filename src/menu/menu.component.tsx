import * as React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

interface route {
    path: string,
    label: string,
    component: new (props: any) => React.Component
}

interface Props {
    routes: Array<route>;
}

export default class Menu extends React.Component<Props> {
    
    render() {
        
        return (
            <div>
                {this.props.routes.map((route, i) => 
                    <MenuLink
                        key={i}
                        activeOnlyWhenExact={i === 0}
                        to={route.path}
                        label={route.label}
                    />
                )}
            </div>
        );
    }
}

const MenuLink = ({ label, to, activeOnlyWhenExact }: {label: string, to: string, activeOnlyWhenExact: boolean}) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <div className={match ? "active" : ""}>
                {match ? "> " : ""}
                <Link to={to}>{label}</Link>
            </div>
        )}
    />
);
