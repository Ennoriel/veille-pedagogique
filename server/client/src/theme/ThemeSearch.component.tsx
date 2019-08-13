import * as React from 'react';

import {
    withStyles, Card, Grid, CardContent,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import ThemeInput from './ThemeInput.component';
import RedirectIf from 'src/shared/RedirectIf.component';
import { store } from 'src/redux.services/index.store';
import { saveActiveRoute } from 'src/redux.services/action/route.action';

const styles = (theme : any) => ({
    card: {
        overflow: 'visible' as 'visible'
    }
});

interface Props {
    classes?: any;
}

interface State {
    redirect: {
        condition: boolean,
        themeRoute: string
    }
}

/**
 * Composant d'affichage des thèmes
 */
class ThemeSearch extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: {
                condition: false,
                themeRoute: ''
            }
        }
    }

    readonly state: State;

    /**
     * Gère la redirection une fois un thème sélectionné
     * @param liste liste d'un élément des thèmes remontés par l'input de recherche des thèmes
     */
    handleThemes = (liste: string[]) => {
        const theme = liste[0];

        this.setState({
            redirect: {
                condition: true,
                themeRoute: "/themes/" + theme
            }
        });

        store.dispatch(saveActiveRoute({
            path: '/themes/' + theme,
            label: 'Thème : ' + theme
        }));
    }

    render(): JSX.Element {
        const { classes } = this.props;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <ThemeInput
                                addNewItems={false}
                                handleRes={this.handleThemes}
                            />
                            <RedirectIf
                                condition={this.state.redirect.condition} 
                                route={this.state.redirect.themeRoute}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ThemeSearch) as WithStyleComponent;
