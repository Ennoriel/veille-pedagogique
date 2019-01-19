import * as React from 'react';

import store from 'src/redux.services/index.store';

import * as _ from "lodash"
import {
    CardHeader,
    Card,
    CardContent,
    Typography,
    Chip,
    CardActions,
    IconButton,
    Divider,
    Tooltip,
    withStyles } from '@material-ui/core';

import { ArticleItem } from 'src/redux.services/constants/article.types';

import VideoCamIcon from '@material-ui/icons/Videocam';
import NotesIcon from '@material-ui/icons/Notes';
import LinkIcon from '@material-ui/icons/Link';
import CreateIcon from '@material-ui/icons/Create';
import classNames from 'classnames';
import { WithStyleComponent } from 'src/shared/standard.types';

const styles = (theme : any) => ({
    card: {
        marginBottom: "20px",
    },
    chip: {
        margin: "0 5px",
    },
    toto: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap" as "wrap",
        marginBottom: "15px"
    },
    cardActions: {
        padding: "8px 22px 8px 10px !important"
    },
    iconeDroite: {
        marginLeft: "auto !important"
    },
    inlineFlex: {
        display: "inline-flex !important"
    }
    
});

export interface Props {
    classes?: any;
}

class Article extends React.Component<Props> {

    articles = store.getState().article;
    auteurs = store.getState().auteur;

    render() {
        const { classes } = this.props;

        return (
            <div>
                {_.values(this.articles).map((article: ArticleItem, index: number) => 
                    <Card key={index} className={classes.card}>
                        <CardHeader
                            title={article.title}
                            subheader={article.createdAt.toDateString()}
                        />
                        <Divider />
                        <CardContent>
                            <div className={classes.toto}>
                                <Chip
                                    className={classes.chip}
                                    label={article.medium}
                                    icon={article.medium == "video" ? <VideoCamIcon /> : <NotesIcon />}
                                />
                                {article.themes.map((theme: string, index: number) => 
                                    <Chip
                                        className={classes.chip}
                                        key={index}
                                        label={theme}
                                    />
                                )}
                            </div>
                            <Typography component="p">
                                {article.description}
                            </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions className={classes.cardActions}>
                            <Tooltip title="Accès direct sur le site" placement="top">
                                <IconButton href={article.url} target="_blank">
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography>
                                sur {article.siteInternet}
                            </Typography>
                            {article.auteur.map((auteurId, index) => 
                                <div key={index} className={classNames({[classes.iconeDroite]: index === 0})}>
                                    <Tooltip title="Accès à la page auteur" placement="top">
                                        <IconButton>
                                            <CreateIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography className={classes.inlineFlex}>
                                        par {this.auteurs[auteurId].nom}
                                    </Typography>
                                </div>
                            )}
                        </CardActions>
                    </Card>
                )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Article) as WithStyleComponent;
