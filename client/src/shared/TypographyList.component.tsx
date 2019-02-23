import * as React from 'react';

import {
    withStyles
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';

const styles = (theme : any) => ({
    liste: {
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: "0.875rem",
        fontWeight: 400,
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        lineHeight: "1.46429em",
    }
});

export interface Props {
    classes?: any
}

export interface State {
    date: number
}

/**
 * Composant permetant de rendre une liste avec le même thême que Typography
 */
class TypographyList extends React.Component<Props> {
    
    render() {
        return (
            <ul className={this.props.classes.liste}>
                {this.props.children}
            </ul>
        );
    }
}

export default withStyles(styles, { withTheme: true })(TypographyList) as WithStyleComponent;