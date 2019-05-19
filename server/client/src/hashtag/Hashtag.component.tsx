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
    TextField,
    IconButton,
} from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';

import { WithStyleComponent } from 'src/shared/standard.types';
import classNames from 'classnames';

import { HashtagItem } from './Hashtag.type';
import { HashtagRepositoryService } from './Hashtag.repositoryService';

const styles = (theme : any) => ({
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
    }
});

interface Props {
    classes?: any;
}

interface State {
    listeHashtag: Array<HashtagItem>
}

let hashtagRepositoryService: HashtagRepositoryService;

/**
 * Composant d'affichage des hastags
 */
class Hashtag extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        hashtagRepositoryService = new HashtagRepositoryService;

        this.state = { listeHashtag: [] }

        hashtagRepositoryService.getHastags().then(value => {
            this.setState({ listeHashtag: value.data })
        }).catch(error => {
            // TODO gérer l'erreur
        });

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
    }

    readonly state: State;

    /**
     * Mise à jour d'un booléen d'un hashtag
     * @param event évènement de saisie
     * @param index indice du hashtag à modifier
     */
    handleCheckboxChange(event: any, index: number) {
        const target = event.target;
        const value = target.checked;
        const booleanToUpdate = target.name;

        let liste = this.state.listeHashtag;
        liste[index][booleanToUpdate] = value;
        this.setState({"listeHashtag": liste});
    }

    /**
     * Mise à jour d'un input d'un hashtag
     * @param event évènement de saisie
     * @param index indice du hashtag à modifier
     */
    handleInputChange(event: any, index: number) {
        let liste = this.state.listeHashtag;
        liste[index]["associatedThemes"] = event.target.value;
        this.setState({"listeHashtag": liste});
    }

    /**
     * Sauvegarde d'un hashtag
     * @param index indice du hashtag à modifier
     */
    handleSaveChange(index: number) {
        hashtagRepositoryService.saveHashtags(this.state.listeHashtag[index]);

        let liste = this.state.listeHashtag;
        liste[index]["saved"] = true;
        this.setState({"listeHashtag": liste});
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={8}>
                    <Table aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classNames(classes.cell, classes.hashtagCellWidth)}
                                    align="center">Entrée</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Articles à supprimer ?</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Hashtag à supprimer ?</TableCell>
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
                                            <TextField
                                                id="synonyme"
                                                name="synonyme"
                                                className={classes.dense}
                                                onChange={(event) => this.handleInputChange(event, index)}
                                                value={hashtag.synonyme}
                                                fullWidth
                                                margin="dense"
                                                variant="outlined"
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
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Hashtag) as WithStyleComponent;
