import * as React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, withStyles } from '@material-ui/core';
import { store } from 'src/redux.services/index.store';
import { saveActiveRoute } from 'src/redux.services/action/route.action';

import MenuBar from './menuBar.component';
import MenuDrawer from './menuDrawer.component';
import MainFrame from './mainFrame.component';
import { MenuRoute } from './menu.types';
import { logout } from 'src/redux.services/action/user.action';
import { DEFAULT_ROUTE } from 'src/redux.services/reducers/route.reducer';
import { ResetArticlePage } from 'src/redux.services/action/config.action';
import { ReplaceAllArticles } from 'src/redux.services/action/article.action';

const styles = (theme : any) => ({
    root: {
        display: 'flex',
        height: '100vh',
        background: 'rgb(240,245,255)'
    },
    main: {
        flex: '0 0 100%'
    }
});

interface Props {
    classes: any;
}

class App extends React.Component<Props> {

    state = {
        open: false,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };
    
    handleRouteChange(route: MenuRoute): void {
        store.dispatch(saveActiveRoute(route));
        this.handleDrawerClose();
    }

    handleLogout(): void {
        store.dispatch(logout());
        store.dispatch(saveActiveRoute(DEFAULT_ROUTE));
        store.dispatch(ResetArticlePage());
        store.dispatch(ReplaceAllArticles([]));
        this.handleDrawerClose();
    }
    
    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <MenuBar
                    open={open}
                    handleDrawerOpen={this.handleDrawerOpen}
                />
                <Router>
                    <div className={classes.main}>
                        <MenuDrawer
                            open={open}
                            handleDrawerClose={this.handleDrawerClose}
                            handleRouteChange={this.handleRouteChange}
                            handleLogout={this.handleLogout}
                        />
                        <MainFrame open={open}/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
