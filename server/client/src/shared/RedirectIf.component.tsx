import * as React from 'react';

import {
    withStyles
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import { Redirect } from 'react-router';

const styles = (theme : any) => ({
});

export interface Props {
    classes?: any
    condition: boolean
    route: string
}

/**
 * Composant permetant de rediriger sur une autre page à une condition
 */
class RedirectIf extends React.Component<Props> {
    
    render() {
        const {condition, route} = this.props;

        return (
            <span>
                {
                    condition ?
                    <Redirect to={route} /> :
                    null
                }
            </span>
        );
    }
}

export default withStyles(styles, { withTheme: true })(RedirectIf) as WithStyleComponent;