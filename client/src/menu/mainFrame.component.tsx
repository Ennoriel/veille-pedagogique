import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { Route } from 'react-router';
import { routes } from './routes';
import classNames from 'classnames';

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
                    <Route
                        key={i}
                        exact path={route.path}
                        component={route.component}
                    />
                )}
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainFrame);
