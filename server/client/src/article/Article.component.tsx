import * as React from 'react';

import { store } from 'src/redux.services/index.store';

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
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import classNames from 'classnames';
import { WithStyleComponent } from 'src/shared/standard.types';
import { SaveArticles, RemoveArticle, ReplaceArticle, ReplaceAllArticles } from 'src/redux.services/action/article.action';
import { ArticleRepositoryService } from './Article.repositoryService';
import { IncrementArticlePage, ResetArticlePage } from 'src/redux.services/action/config.action';
import ArticleCriteresComponent from './ArticleCriteres.component';

import { UserRight } from "src/user/User.types";

import ArticleMiseAJourComponent from './ArticleMiseAJour.component';

import { toFrenchFormatDate } from 'src/shared/date.utils';
import RedirectIf from 'src/shared/RedirectIf.component';

const styles = (theme : any) => ({
    card: {
        marginBottom: "20px",
        overflow: 'visible' as 'visible'
    },
    chip: {
        margin: "0 5px 10px 5px",
    },
    chipContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap" as "wrap",
        marginBottom: "5px"
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
    },
    descriptionWithImage: {
        minHeight: '250px'
    },
    image: {
        borderRadius: '8px',
        float: 'right' as 'right',
        maxWidth: '300px',
        maxHeight: '250px',
        margin: '0 0 15px 15px'
    }
});

export interface Props {
    classes?: any;
    isResearchDisabled?: boolean
    articleCritere: IArticleCritere;
}

let articleRepositoryService: ArticleRepositoryService;
let articles: articleState;

interface State {
    articleCritere: IArticleCritere;
    localArticles: articleState;
    isBeingUpdated: number;
    redirect: {
        condition: boolean,
        themeRoute: string
    }
}

function isSuperUser() {
    return store.getState().user.right === UserRight.SUPER_USER;
}

/**
 * Composant d'affichage des articles
 */
class Article extends React.Component<Props> {

    constructor (props: Props) {
        super (props);

        articleRepositoryService = new ArticleRepositoryService;

        this.state = {
            articleCritere: this.props.articleCritere || new ArticleCritere(),
            localArticles: {},
            isBeingUpdated: -1,
            redirect: {
                condition: false,
                themeRoute: ''
            }
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
        this.handleThemeClick = this.handleThemeClick.bind(this);
    }

    readonly state: State;

    /**
     * Chargement d'une page d'article suppl??mentaire dans le store
     */
    handleLoadMoreArticles() {

        let articleCritere = this.state.articleCritere;
        articleCritere['page'] = store.getState().config.articlePage;

        articleRepositoryService.getArticles(articleCritere).then(value => {
            if(this.props.isResearchDisabled) {
                this.setState({
                    localArticles: {...value.data}
                });
            } else {
                store.dispatch(IncrementArticlePage());
                store.dispatch(SaveArticles(value.data));
            }
        }).catch(error => {
            // TODO g??rer l'erreur
        });
    }

    /**
     * Chargement d'une nouvelle page d'article ?? partir des crit??res de recherche
     * @param articleCritere crit??re de recherche
     */
    handleSearch(articleCritere: IArticleCritere) {

        this.setState({'articleCritere': undefined});
        this.setState({'articleCritere': {...articleCritere}});

        articleRepositoryService.getArticles(articleCritere).then(value => {
            store.dispatch(ResetArticlePage());
            store.dispatch(IncrementArticlePage());
            store.dispatch(ReplaceAllArticles(value.data))
        }).catch(error => {
            // TODO g??rer l'erreur
        });
    }

    /**
     * Cache un article ?? la vu des utilisateurs
     * @param article article ?? cacher
     */
    handleHideArticle(article: ArticleItem, index: number) {
        article.isVisible = !article.isVisible || false;
        articleRepositoryService.updateArticle(article).then(() => {
            store.dispatch(ReplaceArticle(index, article));
        });
    }

    /**
     * Cache un article ?? la vu des utilisateurs
     * @param article article ?? cacher
     */
    handleDeleteArticle(article: ArticleItem, index: number) {
        articleRepositoryService.deleteArticle(article).then(() => {
            store.dispatch(RemoveArticle(index));
        });
    }

    /**
     * Affiche le paneau de mise ?? jour d'un article
     */
    handlOpenUpdateArticlePanel(index: number) {
        this.setState({
            isBeingUpdated: index
        });
    }

    /**
     * Enregistre les modifications d'un article & Le mets ?? jour dans la liste
     */
    handleArticleMaj(index: number, articleNew: ArticleItem) {
        this.setState({
            isBeingUpdated: -1
        });
        articleRepositoryService.updateArticle(articleNew).then(() => {
            store.dispatch(ReplaceArticle(index, articleNew));
        });
    }

    /**
     * Redirection vers la page de d??scription d'un th??me
     * @param theme le th??me sur lequel la description sera faite
     */
    handleThemeClick(theme: string) {
        this.setState({
            redirect: {
                condition: true,
                themeRoute: 'themes/' + theme
            }
        })
    }

    // r??cup??ration des auteurs
    auteurs = store.getState().auteur;

    render() {
        const { classes } = this.props;
        articles = this.props.isResearchDisabled ?
                this.state.localArticles :
                store.getState().article as articleState;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={this.props.isResearchDisabled ? 12 : 8}>
                {!isSuperUser() ? null :
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="body1">
                            Texte ?? destination des administrateurs : tous les articles sont affich??s aux administrateurs. Les messages cach??s apparaissent avec l'icone cach?? (oeil barr??). Une fois un article ??dit??, celui-ci sera visible par tous les utilisateurs.
                        </Typography>
                    </CardContent>
                </Card>
                }
                {
                    !this.props.isResearchDisabled ?
                    <ArticleCriteresComponent
                        handleSearch={this.handleSearch}
                    />
                    :
                    null
                }
                {
                    _.values(articles).length ?
                    <div>
                        {_.values(articles).map((article: ArticleItem, index: number) => 
                            <Card key={index} className={classes.card}>
                                <CardHeader
                                    title={article.title}
                                    subheader={
                                        article.createdAt ? 
                                        toFrenchFormatDate(new Date(article.createdAt)) :
                                        ""
                                    }
                                    action={
                                        <div>
                                            {!isSuperUser() ? null :
                                            [
                                                <IconButton
                                                    key={0}
                                                    color="primary"
                                                    onClick={() => this.handlOpenUpdateArticlePanel(index)}
                                                >
                                                    <CreateIcon />
                                                </IconButton>,
                                                <IconButton
                                                    key={1}
                                                    color="primary"
                                                    onClick={() => this.handleHideArticle(article, index)}
                                                >
                                                    {
                                                        article.isVisible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                                                    }
                                                </IconButton>,
                                                <IconButton
                                                    key={2}
                                                    color="primary"
                                                    onClick={() => this.handleDeleteArticle(article, index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            ]
                                            }
                                        </div>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <div className={classes.chipContainer}>
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
                                                    onClick={() => this.handleThemeClick(theme)}
                                                />
                                            ) : null
                                        }
                                    </div>
                                    <Typography component="p" className={classNames(classes.description, {
                                        [classes.descriptionWithImage]: !!article.topImage,
                                    })}>
                                        {
                                            article.topImage ?
                                            <img src={article.topImage} alt={article.title} className={classes.image}></img> :
                                            null
                                        }
                                        {article.description}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <CardActions className={classes.cardActions}>
                                    <a href={article.url} target="_blank">
                                        <Chip
                                            icon={<LinkIcon />}
                                            label={"sur " + article.siteInternet}
                                            onClick={() => null}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </a>
                                    {
                                        article.auteur ?
                                        article.auteur.map((auteurId, index) => 
                                            <div key={index} className={classNames({[classes.iconeDroite]: index === 0})}>
                                                <Tooltip title="Acc??s ?? la page auteur" placement="top">
                                                    <IconButton>
                                                        <CreateIcon color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography className={classes.inlineFlex}>
                                                    par {this.auteurs[auteurId].nom}
                                                </Typography>
                                            </div>
                                        ) : null
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
                        {
                            !this.props.isResearchDisabled ?
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
                            :
                            null
                        }
                    </div>
                    :
                    <Card>
                        <CardContent>
                            <Typography variant="body1">
                                Aucun article ne correspond ?? votre recherche. Merci de choisir d'autres crit??res de recherche.
                            </Typography>
                        </CardContent>
                    </Card>
                }
            
            </Grid>
                <RedirectIf
                    condition={this.state.redirect.condition}
                    route={this.state.redirect.themeRoute}
                />
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Article) as WithStyleComponent;
