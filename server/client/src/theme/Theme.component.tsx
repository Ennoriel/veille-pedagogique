import * as React from 'react';

import {
    withStyles,
    Grid,
    CardContent,
    Typography,
    Card,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';

import * as _ from 'lodash'
import ThemeGraphComponent from './ThemeGraph.component';
import { RouteComponentProps } from 'react-router';

const styles = (theme : any) => ({
    root: {
        flewGrow: 1
    },
    titre: {
        color: '#3f51b5'
    },
    card: {
        margin: "0 0 10px 0" 
    }
});

interface MatchParams {
    theme: string;
}

interface Props extends RouteComponentProps<MatchParams> {
    classes?: any;
}

interface State {
    theme: string
}

/**
 * Composant d'affichage des thèmes
 */
class Theme extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            theme: this.props.match.params.theme
        }
    }

    readonly state: State;

    render(): JSX.Element {
        const { classes } = this.props;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={8}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                variant="h2"
                                align="center"
                                className={classes.titre}
                            >
                                {this.state.theme}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Grid container spacing={2} justify='center'>
                        <Grid item xs={12} lg={6}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        className={classes.titre}
                                    >
                                        Description
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="body1"
                                        align="center"
                                    >
                                        Sed a justo sit amet velit dictum gravida quis vel ipsum. In nisi sem, malesuada ut odio quis, mollis dictum nulla. Ut fermentum lacus vitae augue tristique, at efficitur quam blandit. Quisque in metus ligula. Vivamus ut dolor vestibulum, pulvinar purus ut, mattis ipsum. Pellentesque ut imperdiet felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pretium eleifend est, ut dictum lectus scelerisque vel. Nulla non urna nunc. Proin rutrum, lacus sit amet egestas sodales, ex lorem finibus purus, quis cursus lectus arcu eu leo. Nullam efficitur gravida orci, vitae accumsan nibh congue id. Sed feugiat fermentum mi a mollis. Vestibulum fringilla sed tortor sed aliquet. Quisque venenatis odio non pharetra interdum. Aliquam porttitor orci in tellus cursus, in tempor leo semper. 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        className={classes.titre}
                                    >
                                        Articles les plus lus
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="body1"
                                        align="center"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo sit amet velit dictum gravida quis vel ipsum. In nisi sem, malesuada ut odio quis, mollis dictum nulla. Ut fermentum lacus vitae augue tristique, at efficitur quam blandit. Quisque in metus ligula. Vivamus ut dolor vestibulum, pulvinar purus ut, mattis ipsum. Pellentesque ut imperdiet felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pretium eleifend est, ut dictum lectus scelerisque vel. Nulla non urna nunc. Proin rutrum, lacus sit amet egestas sodales, ex lorem finibus purus, quis cursus lectus arcu eu leo. Nullam efficitur gravida orci, vitae accumsan nibh congue id. Sed feugiat fermentum mi a mollis. Vestibulum fringilla sed tortor sed aliquet. Quisque venenatis odio non pharetra interdum. Aliquam porttitor orci in tellus cursus, in tempor leo semper. 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        className={classes.titre}
                                    >
                                        Thèmes connexes 
                                    </Typography>
                                </CardContent>
                            </Card>
                            <ThemeGraphComponent themeCenter={this.state.theme} />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        className={classes.titre}
                                    >
                                        Auteurs sur ce thème
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography
                                        variant="body1"
                                        align="center"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo sit amet velit dictum gravida quis vel ipsum. In nisi sem, malesuada ut odio quis, mollis dictum nulla. Ut fermentum lacus vitae augue tristique, at efficitur quam blandit. Quisque in metus ligula. Vivamus ut dolor vestibulum, pulvinar purus ut, mattis ipsum. Pellentesque ut imperdiet felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pretium eleifend est, ut dictum lectus scelerisque vel. Nulla non urna nunc. Proin rutrum, lacus sit amet egestas sodales, ex lorem finibus purus, quis cursus lectus arcu eu leo. Nullam efficitur gravida orci, vitae accumsan nibh congue id. Sed feugiat fermentum mi a mollis. Vestibulum fringilla sed tortor sed aliquet. Quisque venenatis odio non pharetra interdum. Aliquam porttitor orci in tellus cursus, in tempor leo semper. 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Theme) as WithStyleComponent;
