import * as React from "react";
import {
    Typography,
    Grid,
    withStyles,
} from "@material-ui/core";
import { WithStyleComponent } from "src/shared/standard.types";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const styles = (theme : any) => ({
    titre: {
        color: '#3f51b5',
        paddingBottom: '35px'
    },
    circularProgressBar: {
        padding: '20px 60px'
    },
})

export interface Props {
    classes?: any;
}

class Home extends React.Component<Props> {

    render(): JSX.Element {
        const { classes } = this.props;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={8}>
                    <Typography
                        variant="h2"
                        align="center"
                        className={classes.titre}
                    >
                        Loom - Veille pédagogique
                    </Typography>
                    <Typography variant="body1" paragraph align="center">
                        Ce site internet et un démonstrateur rencensant déjà plus de 5000 articles pédagogiques.
                    </Typography>
                    <Typography variant="body1" paragraph align="center">
                        Chaque article résumé regroupe l'auteur, les thèmes et l'accès direct au site de publication. Des pages thématiques détailleront tous les concepts de la pédagogie. Des dossiers viendront donner une vision d'ensemble sur des pratiques actuelles.
                    </Typography>
                    <Grid container justify='center'>
                        <Grid item xs={8} md={4}>
                            <div className={classes.circularProgressBar}>
                                <CircularProgressbar
                                    value={66}
                                    text={`66%`}
                                    styles={buildStyles({pathColor: '#3f51b5', textColor: '#3f51b5',})}
                                />
                            </div>
                            <Typography variant="body1" paragraph align="center">
                                Automatisation de la récupération de contenu
                            </Typography>
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <div className={classes.circularProgressBar}>
                                <CircularProgressbar
                                    value={33}
                                    text={`33%`}
                                    styles={buildStyles({pathColor: '#3f51b5', textColor: '#3f51b5',})}
                                />
                            </div>
                            <Typography variant="body1" paragraph align="center">
                                Création du contenu sur les thèmes et les auteurs
                            </Typography>
                        </Grid>
                        <Grid item xs={8} md={4}>
                            <div className={classes.circularProgressBar}>
                                <CircularProgressbar
                                    value={0}
                                    text={`0%`}
                                    styles={buildStyles({pathColor: '#3f51b5', textColor: '#3f51b5',})}
                                />
                            </div>
                            <Typography variant="body1" paragraph align="center">
                                Ecriture du contenu original
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" paragraph align="center">
                        Si vous souheaitez un accès anticipté, merci de créer un compte et de me contacter en privée <a href="https://twitter.com/m_dupont103" target="_blank">@m_dupont103</a>.
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Home) as WithStyleComponent;
