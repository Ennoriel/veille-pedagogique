import * as React from 'react';
// import ReactDOM from 'react-dom';
import {
    withStyles,
    Card,
    CardHeader,
    Divider,
    CardContent, 
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
    Button,
    IconButton,
    Collapse
} from '@material-ui/core';
import { WithStyleComponent } from 'src/shared/standard.types';
import { ArticleCritere, IArticleCritere } from 'src/redux.services/constants/article.types';
import DownShiftMultipleComponent from 'src/shared/DownShiftMultiple.component';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import classNames from 'classnames';
import { ArticleRepositoryService } from './Article.repositoryService';
import DateFieldComponent from 'src/shared/DateField.component';

const styles = (theme : any) => ({
    card: {
        marginBottom: "20px",
        overflow: 'visible' as 'visible'
    },
    gridInput: {
        padding: "0 8px"
    },
    gridCheckBox: {
        marginTop: "18px"
    },
    gridButton: {
        marginTop: "21px"
    },
});

export interface Props {
    handleSearch: (article: IArticleCritere) => void;
    classes?: any;
}

interface State {
    article: IArticleCritere;
    expanded: boolean;
    suggestions: Array<string>;
    articleMedium: {
        'video': boolean,
        'blog': boolean,
        'presse': boolean
    }
}

let articleRepositoryService: ArticleRepositoryService;

class ArticleCriteres extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        articleRepositoryService = new ArticleRepositoryService;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);

        this.state = {
            article: new ArticleCritere(),
            expanded: false,
            suggestions: new Array<string>(),
            articleMedium: {
                'video': true,
                'blog': true,
                'presse': true
            }
        };

        this.getSuggestions();
    }

    readonly state: State;

    /**
     * Initialise les suggestions de thèmes
     */
    getSuggestions() {
        articleRepositoryService.getThemes().then(themes => {
            this.setState({
                suggestions: themes.data
            });
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    /**
     * Gestion de la sauvegarde des termes à rechercher
     */
    handleThemes = (liste: string[]) => {
        this.setState({
            article: {
                ...this.state.article,
                themes: liste
            }
        })
    }

    /**
     * Gestion de l'expansion du panneau de recherche
     */
    handleExpandClick() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    /**
     * Gestion des valeurs et erreurs
     * @param event évènement de saisie
     */
    handleInputChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            "article": {
                ...this.state.article,
                [name]: value
            }
        });
    }

    /**
     * Gestion des valeurs et erreurs
     * @param event évènement de saisie
     */
    handleCheckboxChange(event: any) {
        const target = event.target;
        const value = target.checked;
        const inputMedium = target.name;
        
        this.setState({
            'articleMedium': {
                ...this.state.articleMedium,
                [inputMedium]: value
            }
        })
        
        if(value) {
            this.setState({
                'article': {
                    ...this.state.article,
                    'medium': [
                        ...this.state.article.medium!,
                        inputMedium
                    ]
                }
            });
        } else {
            this.setState({
                'article': {
                    ...this.state.article,
                    'medium': [
                        ...this.state.article.medium!.filter(medium => medium !== inputMedium)
                    ]
                }
            })
        }
    }

    /**
     * Gestion de l'appuie sur le bouton "search"
     * Ferme le panneau de recherche et renvoit l'événement au composant parent
     */
    handleSearch = () => {
        this.handleExpandClick();
        this.props.handleSearch(this.state.article);
    }
    
    render() {
        const { classes } = this.props;
        
        return (
            <Card className={classes.card}>
                <CardHeader
                    title="Critères de recherche"
                    action={
                        <IconButton
                            className={classNames(classes.expand, {
                                    [classes.expandOpen]: this.state.expanded,
                                })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }>
                        <div>Hello</div>
                    </CardHeader>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} lg={3} className={classes.gridInput}>
                            <TextField
                                id="title"
                                label="Title"
                                name="title"
                                onChange={this.handleInputChange}
                                value={this.state.article.title}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} className={classes.gridInput}>
                            <TextField
                                id="description"
                                label="Description"
                                name="description"
                                onChange={this.handleInputChange}
                                value={this.state.article.description}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} className={classes.gridInput}>
                            <TextField
                                id="siteInternet"
                                label="Site Internet"
                                name="siteInternet"
                                onChange={this.handleInputChange}
                                value={this.state.article.siteInternet}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} className={classNames(classes.gridInput, classes.gridCheckBox)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="video"
                                        onChange={this.handleCheckboxChange}
                                        checked={this.state.articleMedium.video}
                                        color="primary"
                                    />
                                }
                                label="Vidéo"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="blog"
                                        onChange={this.handleCheckboxChange}
                                        checked={this.state.articleMedium.blog}
                                        color="primary"
                                    />
                                }
                                label="Blog"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="presse"
                                        onChange={this.handleCheckboxChange}
                                        checked={this.state.articleMedium.presse}
                                        color="primary"
                                    />
                                }
                                label="Presse"
                            />
                        </Grid>
                        <Grid item xs={12} lg={6} className={classes.gridInput}>
                            <DownShiftMultipleComponent
                                label="themes"
                                liste={this.state.suggestions}
                                addNewItems={false}
                                value={this.state.article.themes}
                                handleRes={this.handleThemes}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} className={classes.gridInput}>
                            <DateFieldComponent
                                value={this.state.article.createdAt}
                                onChange={this.handleInputChange}
                                id="createdAt"
                                label="Created after"
                                name="createdAt"
                            />
                        </Grid>
                        <Grid item xs={12} lg={3} className={classNames(classes.gridInput, classes.gridButton)}>
                            <Button
                                onClick={this.handleSearch}
                                variant="outlined" 
                                size="large" 
                                color="primary"
                                className={classes.buttonWidth}>
                                    Search
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
                </Collapse>
            </Card>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleCriteres) as WithStyleComponent;