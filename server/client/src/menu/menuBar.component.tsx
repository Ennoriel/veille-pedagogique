import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, withStyles } from '@material-ui/core';

import classNames from 'classnames';

import MenuIcon from '@material-ui/icons/Menu';
import { routes } from './routes';
import { Route, Switch } from 'react-router';

const drawerWidth = 240;

const styles = (theme : any) => ({
    appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    }
});

interface Props {
    open: boolean;
    handleDrawerOpen: () => void;
    classes: any;
}

/**
 * Barre principale de l'application
 */
class MenuBar extends React.Component<Props> {

    render() {
        const { classes, open } = this.props;
        
        return (
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar disableGutters={!open}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.props.handleDrawerOpen}
                        className={classNames(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Switch>
                        {routes.map((route, i) =>
                            <Route
                                key={i}
                                path={route.path}
                                render={() => <Title label={route.label} />}
                            />
                        )}
                    </Switch>
                </Toolbar>
            </AppBar>
        );
    }
}

function Title(props: {label: string}) {
    return (
        <Typography variant="h5" color="inherit" noWrap>
            {props.label}
        </Typography>
    );
}

export default withStyles(styles, { withTheme: true })(MenuBar);
