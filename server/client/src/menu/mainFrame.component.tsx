import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { Route, Redirect, RouteProps } from 'react-router';
import { routes } from './routes';
import classNames from 'classnames';
import { DEFAULT_ROUTE } from 'src/redux.services/reducers/route.reducer';
import store from 'src/redux.services/index.store';
import { UserRight } from 'src/user/User.types';
import { WithStyleComponent } from 'src/shared/standard.types';

const drawerWidth = 240;

const styles = (theme : any) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }
})

export interface Props {
    open: boolean;
    classes: any;
}

/**
 * Page principale de l'application
 */
class MainFrame extends React.Component<Props> {
    
    render() {
        const { classes, open } = this.props;
        
        return (
            <main
                className={classNames(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {routes.map((route, i) =>
                    <CustomRoute
                        component={route.component}
                        privilege={route.userRights}
                        key={i}
                        exact path={route.path}
                    />
                )}
                <Redirect
                    to={DEFAULT_ROUTE.path}
                />
            </main>
        );
    }
}

interface CustomRouteProps {
    component: WithStyleComponent,
    privilege: Array<UserRight>
}

class CustomRoute extends React.Component<CustomRouteProps & RouteProps> {

    isAuthenticated(routePrivilege: Array<UserRight>) {
        return routePrivilege.includes(store.getState().user.right!);
    }

    render() {
       const {component: Component, privilege, ...rest} = this.props;

       const renderRoute = (props: any) => {
           
           if (this.isAuthenticated(privilege)) {
              return (
                  <Component {...props} />
              );
           }

           return (
               <Redirect to={DEFAULT_ROUTE.path} />
           );
       }

       return (
           <Route {...rest} render={renderRoute}/>
       );
    }
}

export default withStyles(styles, { withTheme: true })(MainFrame);
