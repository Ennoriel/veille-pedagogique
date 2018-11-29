import * as React from 'react';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, IconButton, withStyles } from '@material-ui/core';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { routes } from './routes';
import { MenuRoute } from './menu.types';

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
    }
})

interface Props {
    open: boolean;
    handleDrawerClose: () => void;
    handleRouteChange: (route: MenuRoute) => void;
    classes: any;
    theme: any;
}

/**
 * Drawer principal de l'application
 */
class MenuDrawer extends React.Component<Props> {
    
    render() {
        const { classes, theme, open } = this.props;
        
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
                <List>
                    {routes.map((route, index) => (
                        <Route
                            path={route.path}
                            key={index}
                            children={({ match }) => (
                                <Link
                                    to={route.path}
                                    onClick={() => this.props.handleRouteChange(route)}
                                >
                                    <ListItem button>
                                        <ListItemIcon>{route.icon}</ListItemIcon>
                                        <ListItemText primary={route.label} />
                                    </ListItem>
                                </Link>
                            )}
                        />
                    ))}
                </List>
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MenuDrawer);
