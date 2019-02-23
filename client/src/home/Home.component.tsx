import * as React from "react";
import { Typography, Grid, withStyles } from "@material-ui/core";
import { WithStyleComponent } from "src/shared/standard.types";

const styles = (theme : any) => ({
})

export interface Props {
    classes?: any;
}

class Home extends React.Component<Props> {

    render(): JSX.Element {

        return (
            <Grid container justify='center'>
                <Grid item xs={10} lg={8}>
                    <Typography variant="h2" paragraph>
                        Home Page
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Ce site internet et une démo visant à "rassembler les connaissances pédagogiques pratiques en un seul endroit". Il rassemble une dizaine de nouveaux articles publiés sur internet chaque jour.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Chaque article contient les informations suivantes :
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <ul>
                            <li>titre</li>
                            <li>date de publication</li>
                            <li>description</li>
                            <li>url du site internet</li>
                            <li>url de l'article</li>
                            <li>médium (vidéo, blog, presse)</li>
                            <li>thèmes</li>
                        </ul>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Si vous souheaitez avoir un accès au site, merci de créer un compte et de me contacter en privée <a href="https://twitter.com/m_dupont103" target="_blank">@m_dupont103</a>.
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Home) as WithStyleComponent;
