import * as React from 'react';

import {
    withStyles,
    TextField,
    Button,
    MenuItem,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import { ArticleItem } from 'src/redux.services/constants/article.types';
import DateFieldComponent from 'src/shared/DateField.component';
import { ArticleRepositoryService } from './Article.repositoryService';
import DownShiftMultipleComponent from 'src/shared/DownShiftMultiple.component';

let articleRepositoryService: ArticleRepositoryService;

const styles = (theme : any) => ({
    medium: {
        width: '100%'
    },
    menu: {
        width: 200,
    },
});

export interface Props {
    article: ArticleItem,
    handleArticleMaj: (article: ArticleItem) => void
    classes?: any;
}

interface State {
    article: ArticleItem;
    suggestions: Array<string>;
}

/**
 * Composant d'affichage des articles
 */
class ArticleMiseAJour extends React.Component<Props> {

    constructor (props: Props) {
        super (props);

        articleRepositoryService = new ArticleRepositoryService;

        this.state = {
            article: this.props.article,
            suggestions: new Array<string>(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleArticleMaj = this.handleArticleMaj.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

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
     * Ajoute la date d'aprobabation de l'article et transmet l'article au composant parent
     * pour l'enregistrement et la mise à jour de l'article affiché
     */
    handleArticleMaj() {
        this.setState({
            ...this.state.article,
            article : {
                approvedAt: new Date().getTime()
            }
        })
        
        this.props.handleArticleMaj(this.state.article)
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
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
                <DateFieldComponent
                    value={this.state.article.createdAt}
                    onChange={this.handleInputChange}
                    id="createdAt"
                    label="Created at"
                    name="createdAt"
                />
                <TextField
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    onChange={this.handleInputChange}
                    value={this.state.article.description}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="medium"
                    select
                    label="Medium"
                    name="medium"
                    className={classes.medium}
                    value={this.state.article.medium}
                    onChange={this.handleInputChange}
                    SelectProps={{
                        MenuProps: {
                        className: classes.menu,
                        },
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    {["blog", "presse", "video"].map(option => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <DownShiftMultipleComponent
                    label="themes"
                    liste={this.state.suggestions}
                    addNewItems={true}
                    value={this.state.article.themes}
                    handleRes={this.handleThemes}
                />
                <Button
                    onClick={this.handleArticleMaj}
                    variant="outlined" 
                    size="large" 
                    color="primary">
                        Save
                </Button>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleMiseAJour) as WithStyleComponent;
