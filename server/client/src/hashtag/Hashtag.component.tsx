import * as React from 'react';

import {
    withStyles,
    Grid,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Checkbox,
    IconButton,
    Card,
    CardContent,
    Typography,
    Button,
} from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';

import { WithStyleComponent } from 'src/shared/standard.types';
import classNames from 'classnames';

import { HashtagItem } from './Hashtag.type';
import ThemeInput from 'src/theme/ThemeInput.component';

import { HashtagRepositoryService } from './Hashtag.repositoryService';
import { ArticleRepositoryService } from 'src/article/Article.repositoryService';

import * as _ from "lodash";

const styles = (theme : any) => ({
    card: {
        marginBottom: "20px"
    },
    hashtagCellWidth: {
        width: "30%"
    },
    booleanCellWidth: {
        width: "10%"
    },
    actionCellWidth: {
        width: "10%"
    },
    synonymeCellWidth: {
        marginTop: "4px",
        width: "40%"
    },
    cell: {
        padding: "0 10px"
    },
    dense: {
        marginTop: "4px"
    },
    buttonWidth: {
        width: '175px'
    },
    gridButton: {
        padding: "16px"
    },
});

interface Props {
    classes?: any;
}

interface State {
    listeHashtag: Array<HashtagItem>,
    themeSuggestions: Array<string>
    indexed: boolean,
    notIndexed: boolean
}

let hashtagRepositoryService: HashtagRepositoryService;
let articleRepositoryService: ArticleRepositoryService;

/**
 * Composant d'affichage des hastags
 */
class Hashtag extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        hashtagRepositoryService = new HashtagRepositoryService;

        this.state = {
            listeHashtag: [],
            themeSuggestions: [],
            indexed: false,
            notIndexed: true
        }

        articleRepositoryService = new ArticleRepositoryService;

        this.getSuggestions().then(() => this.loadHashtags());

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
        this.handleIndexedHashtagsButton = this.handleIndexedHashtagsButton.bind(this);
        this.handleNotYetIndexedHashtagsButton = this.handleNotYetIndexedHashtagsButton.bind(this);
    }

    readonly state: State;

    loadHashtags() {
        hashtagRepositoryService.getHastags(this.state.indexed, this.state.notIndexed).then(value => {
            this.setState({ listeHashtag: value.data })
        }).catch(error => {
            // TODO g??rer l'erreur
        });
    }

    /**
     * Initialise les suggestions de th??mes
     */
    getSuggestions() {
        return articleRepositoryService.getThemes().then(themes => {
            this.setState({
                themeSuggestions: themes.data
            });
        }).catch(error => {
            // TODO g??rer l'erreur
        });
    }

    /**
     * Mise ?? jour d'un bool??en d'un hashtag
     * @param event ??v??nement de saisie
     * @param index indice du hashtag ?? modifier
     */
    handleCheckboxChange(event: any, index: number) {
        const target = event.target;
        const value = target.checked;
        const booleanToUpdate = target.name;

        let liste = this.state.listeHashtag;
        liste[index][booleanToUpdate] = value;
        liste[index]['saved'] = false;
        this.setState({"listeHashtag": liste});
    }

    /**
     * Sauvegarde d'un hashtag
     * @param index indice du hashtag ?? modifier
     */
    handleSaveChange(index: number) {

        let listeHashtag = this.state.listeHashtag;
        let hashtag = listeHashtag[index];

        if(hashtag.articleToBeDeleted || hashtag.themeToBeDeleted || !!hashtag.associatedThemes.length) {

            hashtagRepositoryService.saveHashtags(hashtag);
            listeHashtag[index]["saved"] = true;
            this.setState({"listeHashtag": listeHashtag});
        }
    }

    /**
     * Gestion de la sauvegarde des termes ?? rechercher
     */
    handleThemes = (listeThemes: Array<string>, index: number) => {
        let listeHashtag = this.state.listeHashtag;

        listeHashtag[index]["associatedThemes"] = listeThemes;
        listeHashtag[index]['saved'] = false;
        this.setState({"listeHashtag": listeHashtag});
    }

    handleIndexedHashtagsButton() {
        this.setState({
            indexed: !this.state.indexed
        }, () =>
            this.loadHashtags()
        );
    }

    handleNotYetIndexedHashtagsButton() {
        this.setState({
            notIndexed: !this.state.notIndexed
        }, () =>
            this.loadHashtags()
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={8}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="body1">
                                Texte ?? destination des administrateurs : cette page permet d'associer les th??mes aux hashtags twitter.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Grid container justify='center'>
                        <Grid item className={classes.gridButton}>
                            <Button
                                onClick={this.handleIndexedHashtagsButton}
                                variant="outlined" 
                                size="large" 
                                color={this.state.indexed ? "primary" : "secondary"}
                                className={classes.buttonWidth}>
                                    Th??mes ind??x??s
                            </Button>
                        </Grid>
                        <Grid item className={classes.gridButton}>
                            <Button
                                onClick={this.handleNotYetIndexedHashtagsButton}
                                variant="outlined" 
                                size="large" 
                                color={this.state.notIndexed ? "primary" : "secondary"}
                                className={classes.buttonWidth}>
                                    Th??mes non ind??x??s
                            </Button>
                        </Grid>
                    </Grid> 
                    {
                        _.values(this.state.listeHashtag).length ?
                    <div>
                    <Table aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classNames(classes.cell, classes.hashtagCellWidth)}
                                    align="center">Entr??e</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Articles ?? supprimer ?</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Hashtag ?? supprimer ?</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.synonymeCellWidth)}
                                    align="center">Synonymes</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.actionCellWidth)}
                                    align="center">Sauvegrader</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.listeHashtag.map((hashtag: HashtagItem, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        selected={hashtag.saved}
                                        key={index}
                                    >
                                        <TableCell
                                            className={classNames(classes.cell, classes.hashtagCellWidth)}
                                            align="center">{hashtag.entry}</TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.booleanCellWidth)}
                                            align="center"
                                        >
                                            <Checkbox
                                                name="articleToBeDeleted"
                                                color="primary"
                                                checked={hashtag.articleToBeDeleted}
                                                onChange={(event) => this.handleCheckboxChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.booleanCellWidth)}
                                            align="center"
                                        >
                                            <Checkbox
                                                name="themeToBeDeleted"
                                                color="primary"
                                                checked={hashtag.themeToBeDeleted}
                                                onChange={(event) => this.handleCheckboxChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.synonymeCellWidth)}
                                            align="center"
                                        >
                                            <ThemeInput
                                                addNewItems={true}
                                                handleRes={(liste:Array<string>) => this.handleThemes(liste, index)}
                                                noLabel={true}
                                                margin="dense"
                                                suggestions={this.state.themeSuggestions}
                                                selectedThemes={hashtag.associatedThemes}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.actionCellWidth)}
                                            align="center"
                                        >
                                            <IconButton
                                                key={index}
                                                disabled={hashtag.saved}
                                                onClick={() => this.handleSaveChange(index)}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    </div>
                    :
                    <Card>
                        <CardContent>
                            <Typography variant="body1">
                                Il ne reste plus aucune hashtag ?? traiter !
                            </Typography>
                        </CardContent>
                    </Card>
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Hashtag) as WithStyleComponent;
