import * as React from 'react';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, IconButton, withStyles } from '@material-ui/core';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { routes } from './routes';
import { UserService } from 'src/user/User.service';

import PauseIcon from '@material-ui/icons/Pause';
import { UserRight } from 'src/user/User.types';
import { DEFAULT_ROUTE } from 'src/menu/routes';

const drawerWidth = 240;

const styles = (theme: any) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    routeList: {
        position: 'relative' as 'relative',
        height: '100%'
    },
    logout: {
        position: 'absolute' as 'absolute',
        bottom: '10px'
    },
    liens: {
        textDecoration: 'none'
    }
})

interface Props {
    open: boolean;
    handleDrawerClose: () => void;
    handleLogout: () => void;
    classes: any;
    theme: any;
}

let userService: UserService;

/**
 * Drawer principal de l'application
 */
class MenuDrawer extends React.Component<Props> {

    constructor (props: Props) {
        super(props);

        userService = new UserService;
    }
    
    render() {
        const { classes, theme, open } = this.props;
        const userRight = userService.getUserRight();
        
        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.props.handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List className={classes.routeList}>
                    {routes.filter(route => route.userRights
                                .some(routeRight => routeRight === userRight)
                            )
                            .filter(route => route.isDisplayedInMenu)
                            .map((route, index) => (
                        <Route
                            path={route.path}
                            key={index}
                            children={({ match }) => (
                                <Link
                                    to={route.path}
                                    onClick={() => this.props.handleDrawerClose()}
                                    className={classes.liens}
                                >
                                    <ListItem button>
                                        <ListItemIcon>{route.icon}</ListItemIcon>
                                        <ListItemText primary={route.label} />
                                    </ListItem>
                                </Link>
                            )}
                        />
                    ))}
                    {
                        userRight !== UserRight.NOT_AUTH ?
                        <Route
                            path={DEFAULT_ROUTE.path}
                            children={({ match }) => (
                                <Link
                                    to={DEFAULT_ROUTE.path}
                                    onClick={() => this.props.handleLogout()}
                                >
                                    <ListItem button className={classes.logout}>
                                        <ListItemIcon><PauseIcon color="primary"/></ListItemIcon>
                                        <ListItemText primary="Se d??connecter" />
                                    </ListItem>
                                </Link>
                            )}
                        />
                        : ""
                    }
                </List>
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MenuDrawer);
