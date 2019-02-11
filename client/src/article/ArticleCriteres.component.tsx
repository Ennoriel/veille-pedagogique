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
            suggestions: new Array<string>()
        };

        this.getSuggestions();
    }

    getSuggestions() {
        articleRepositoryService.getThemes().then(themes => {
            this.setState({
                suggestions: themes.data
            });
            console.log(this.state.suggestions)
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    readonly state: State;

    handleThemes = (liste: string[]) => {
        this.setState({
            article: {
                ...this.state.article,
                themes: liste
            }
        })
    }

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
        const name = target.name;
        
        this.setState({
            "article": {
                ...this.state.article,
                medium: {
                    ...this.state.article.medium,
                    [name]: value
                }
            }
        });
    }

    handleSearch = () => {
        console.log(this.state.article);
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
                    }/>
                {/* <CardActions className={classes.actions} disableActionSpacing> */}
                    
                {/* </CardActions> */}
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <Grid container>
                        <Grid item xs={6} lg={3} className={classes.gridInput}>
                            <TextField
                                id="title"
                                label="Title"
                                name="title"
                                onChange={this.handleInputChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} className={classes.gridInput}>
                            <TextField
                                id="description"
                                label="Description"
                                name="description"
                                onChange={this.handleInputChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} className={classes.gridInput}>
                            <TextField
                                id="siteInternet"
                                label="Site Internet"
                                name="siteInternet"
                                onChange={this.handleInputChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} className={classNames(classes.gridInput, classes.gridCheckBox)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="video"
                                        onChange={this.handleCheckboxChange}
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
                                handleRes={this.handleThemes}
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} className={classes.gridInput}>
                            <TextField
                                id="createdAt"
                                label="Created At"
                                name="createdAt"
                                type="date"
                                onChange={this.handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} className={classNames(classes.gridInput, classes.gridButton)}>
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