import * as React from 'react';

import store from 'src/redux.services/index.store';

import './Article.component.css';

import * as _ from "lodash"
import { CardHeader, Card, CardContent, Typography, Chip, CardActions, IconButton, Divider, Tooltip } from '@material-ui/core';
import { ArticleItem } from 'src/redux.services/constants/article.types';

import VideoCamIcon from '@material-ui/icons/Videocam'
import NotesIcon from '@material-ui/icons/Notes'
import LinkIcon from '@material-ui/icons/Link'
import CreateIcon from '@material-ui/icons/Create'
import Title from 'src/shared/title.component';

export interface Props {
}

export default class Article extends React.Component<Props> {

    articles = store.getState().article;
    auteurs = store.getState().auteur;

    render() {
        return (
            <div>
                <Title title="Articles" />
                {_.values(this.articles).map((article: ArticleItem, index: number) => 
                    <Card key={index} className="card">
                        <CardHeader
                            title={article.title}
                            subheader={article.date.toDateString()}
                        />
                        <Divider />
                        <CardContent>
                            <div className="chip-group">
                                <Chip
                                    className="chip"
                                    label={article.medium}
                                    icon={article.medium == "video" ? <VideoCamIcon /> : <NotesIcon />}
                                />
                                {article.themes.map((theme: string, index: number) => 
                                    <Chip
                                        className="chip"
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
                        <CardActions className="card-actions">
                            <Tooltip title="Accès direct sur le site" placement="top">
                                <IconButton href={article.url} target="_blank">
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography>
                                sur {article.siteInternet}
                            </Typography>
                            <Tooltip title="Accès à la page auteur" placement="top">
                                <IconButton className="icone-droite">
                                    <CreateIcon />
                                </IconButton>
                            </Tooltip>
                                <Typography>
                                    par {this.auteurs[article.auteur].nom}
                                </Typography>
                        </CardActions>
                    </Card>
                )}
            </div>
        );
    }
}
