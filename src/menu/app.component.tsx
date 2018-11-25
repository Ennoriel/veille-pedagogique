import * as React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, withStyles } from '@material-ui/core';
import store from 'src/redux.services/index.store';
import { saveActiveRoute } from 'src/redux.services/action/route.action';

import MenuBar from './menuBar.component';
import MenuDrawer from './menuDrawer.component';
import MainFrame from './mainFrame.component';
import { MenuRoute } from './menu.types';

const styles = (theme : any) => ({
    root: {
        display: 'flex',
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
                    <div>
                        <MenuDrawer
                            open={open}
                            handleDrawerClose={this.handleDrawerClose}
                            handleRouteChange={this.handleRouteChange}
                        />
                        <MainFrame open={open}/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
