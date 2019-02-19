import * as React from 'react';

import {
    withStyles, Typography,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';

const styles = (theme : any) => ({
});

export interface Props {
    classes?: any;
}

interface State {
}

/**
 * Composant d'affichage des articles
 */
class ArticleMiseAJour extends React.Component<Props> {

    constructor (props: Props) {
        super (props);

        this.state = {
        };
    }

    readonly state: State;

    render() {
        // const { classes } = this.props;

        return (
            <Typography>
                Toto
            </Typography>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleMiseAJour) as WithStyleComponent;
