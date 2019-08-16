import * as React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, withStyles } from '@material-ui/core';
import { store } from 'src/redux.services/index.store';

import MenuBar from './menuBar.component';
import MenuDrawer from './menuDrawer.component';
import MainFrame from './mainFrame.component';
import { logout } from 'src/redux.services/action/user.action';
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

    handleLogout(): void {
        store.dispatch(logout());
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
                <Router>
                    <MenuBar
                        open={open}
                        handleDrawerOpen={this.handleDrawerOpen}
                    />
                    <div className={classes.main}>
                        <MenuDrawer
                            open={open}
                            handleDrawerClose={this.handleDrawerClose}
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
