import * as React from 'react';

import store from 'src/redux.services/index.store';

import * as _ from "lodash";
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
    withStyles, 
    Grid,
    Button
} from '@material-ui/core';

import { ArticleItem, articleState, IArticleCritere, ArticleCritere } from 'src/redux.services/constants/article.types';

import VideoCamIcon from '@material-ui/icons/Videocam';
import NotesIcon from '@material-ui/icons/Notes';
import LinkIcon from '@material-ui/icons/Link';
import CreateIcon from '@material-ui/icons/Create';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import classNames from 'classnames';
import { WithStyleComponent } from 'src/shared/standard.types';
import { SaveArticles, RemoveArticle, ReplaceArticle, ReplaceAllArticles } from 'src/redux.services/action/article.action';
import { ArticleRepositoryService } from './Article.repositoryService';
import { IncrementArticlePage, ResetArticlePage } from 'src/redux.services/action/config.action';
import ArticleCriteresComponent from './ArticleCriteres.component';

import { UserRight } from "src/user/User.types";
import { isNullOrUndefined } from 'util';
import ArticleMiseAJourComponent from './ArticleMiseAJour.component';

import { toFrenchFormatDate } from 'src/shared/date.utils';

const styles = (theme : any) => ({
    card: {
        marginBottom: "20px",
        overflow: 'visible' as 'visible'
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
    },
    buttonWidth: {
        width: '350px'
    },
    description: {
        whiteSpace: 'pre-line' as 'pre-line'
    }
});

export interface Props {
    classes?: any;
}

let articleRepositoryService: ArticleRepositoryService;
let articles: articleState;

interface State {
    articleCritere: IArticleCritere;
    isBeingUpdated: number;
}

function isSuperUser() {
    return store.getState().user.userRight === UserRight.SUPER_USER;
}

/**
 * Composant d'affichage des articles
 */
class Article extends React.Component<Props> {

    constructor (props: Props) {
        super (props);

        articleRepositoryService = new ArticleRepositoryService;

        this.state = {
            articleCritere: new ArticleCritere(),
            isBeingUpdated: -1
        };

        if (store.getState().config.articlePage === 0){
            this.handleLoadMoreArticles();
        }

        this.handleLoadMoreArticles = this.handleLoadMoreArticles.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleHideArticle = this.handleHideArticle.bind(this);
        this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
        this.handlOpenUpdateArticlePanel = this.handlOpenUpdateArticlePanel.bind(this);
        this.handleArticleMaj = this.handleArticleMaj.bind(this);
    }

    readonly state: State;

    /**
     * Chargement d'une page d'article supplémentaire dans le store
     */
    handleLoadMoreArticles() {

        let articleCritere = this.state.articleCritere;
        articleCritere['page'] = store.getState().config.articlePage;

        articleRepositoryService.getArticles(articleCritere).then(value => {
            store.dispatch(IncrementArticlePage());
            store.dispatch(SaveArticles(value.data))
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    /**
     * Chargement d'une nouvelle page d'article à partir des critères de recherche
     * @param articleCritere critère de recherche
     */
    handleSearch(articleCritere: IArticleCritere) {

        this.setState({'articleCritere': undefined});
        this.setState({'articleCritere': {...articleCritere}});

        articleRepositoryService.getArticles(articleCritere).then(value => {
            store.dispatch(ResetArticlePage());
            store.dispatch(IncrementArticlePage());
            store.dispatch(ReplaceAllArticles(value.data))
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    /**
     * Cache un article à la vu des utilisateurs
     * @param article article à cacher
     */
    handleHideArticle(article: ArticleItem, index: number) {
        article.isVisible = false;
        articleRepositoryService.updateArticle(article).then(() => {
            store.dispatch(RemoveArticle(index));
        });
    }

    /**
     * Cache un article à la vu des utilisateurs
     * @param article article à cacher
     */
    handleDeleteArticle(article: ArticleItem, index: number) {
        articleRepositoryService.deleteArticle(article).then(() => {
            store.dispatch(RemoveArticle(index));
        });
    }

    /**
     * Affiche le paneau de mise à jour d'un article
     */
    handlOpenUpdateArticlePanel(index: number) {
        this.setState({
            isBeingUpdated: index
        });
    }

    /**
     * Enregistre les modifications d'un article & Le mets à jour dans la liste
     */
    handleArticleMaj(index: number, articleNew: ArticleItem) {
        this.setState({
            isBeingUpdated: -1
        });
        articleRepositoryService.updateArticle(articleNew).then(() => {
            store.dispatch(ReplaceArticle(index, articleNew));
        });
    }

    // réccupération des auteurs
    auteurs = store.getState().auteur;

    render() {
        const { classes } = this.props;
        articles = store.getState().article as articleState;

        return (
            <div>
                <ArticleCriteresComponent
                    handleSearch={this.handleSearch}
                />
                {
                    _.values(articles).length ?
                    <div>
                        {_.values(articles).map((article: ArticleItem, index: number) => 
                            <Card key={index} className={classes.card}>
                                <CardHeader
                                    title={article.title}
                                    subheader={toFrenchFormatDate(new Date(article.indexedAt))}
                                    action={
                                        <div>
                                            <IconButton>
                                                <FavoriteIcon />
                                            </IconButton>
                                            <IconButton>
                                                <ShareIcon />
                                            </IconButton>
                                            {!isSuperUser() ? null :
                                            [
                                                <IconButton key={0} onClick={() => this.handlOpenUpdateArticlePanel(index)}>
                                                    <CreateIcon />
                                                </IconButton>,
                                                <IconButton key={1} onClick={() => this.handleHideArticle(article, index)}>
                                                    <RemoveRedEyeIcon />
                                                </IconButton>,
                                                <IconButton key={2} onClick={() => this.handleDeleteArticle(article, index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            ]
                                            }
                                        </div>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <div className={classes.toto}>
                                        {
                                            article.medium ?
                                                <Chip
                                                    className={classes.chip}
                                                    label={article.medium}
                                                    icon={article.medium == "video" ? <VideoCamIcon /> : <NotesIcon />}
                                                />
                                            : null
                                        }
                                        {
                                            article.themes ?
                                            article.themes.map((theme: string, index: number) => 
                                                <Chip
                                                    className={classes.chip}
                                                    key={index}
                                                    label={theme}
                                                />
                                            ) : null
                                        }
                                    </div>
                                    <Typography component="p" className={classes.description}>
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
                                    {
                                        article.auteur ?
                                        article.auteur.map((auteurId, index) => 
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
                                        ) : isNullOrUndefined
                                    }
                                </CardActions>
                                <span>
                                    {
                                        this.state.isBeingUpdated === index ?
                                        (
                                            <span>
                                                <Divider />
                                                <CardContent>
                                                    <ArticleMiseAJourComponent
                                                        article={article}
                                                        handleArticleMaj={(articleNew: ArticleItem) => this.handleArticleMaj(index, articleNew)}/>
                                                </CardContent>
                                            </span>
                                        ) : null
                                    }
                                </span>
                            </Card>
                        )}
                        <Grid container justify='center'>
                            <Grid item>
                                <Button
                                    onClick={this.handleLoadMoreArticles}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary"
                                    className={classes.buttonWidth}>
                                        Load more articles
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    : <Typography>Aucun article ne correspond à votre recherche. Merci de choisir d'autres critères de recherche.</Typography>
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Article) as WithStyleComponent;
