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
    liste: Array<HashtagItem>
}

/**
 * Composant d'affichage des hastags
 */
class Hashtag extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            liste: [
                {
                    _id: "dfdfdff",
                    entry: "pedagogie",
                    articleToBeDeleted: false,
                    themeToBeDeleted: false,
                    synonyme: "Pédagogie"
                },
                {
                    _id: "dfdfdff",
                    entry: "philipe",
                    articleToBeDeleted: true,
                    themeToBeDeleted: false,
                    synonyme: "Phillipe"
                }
            ]
        }

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

        let liste = this.state.liste;
        liste[index][booleanToUpdate] = value;
        liste[index]["saved"] = false;
        this.setState(liste);
    }

    /**
     * Mise à jour d'un input d'un hashtag
     * @param event évènement de saisie
     * @param index indice du hashtag à modifier
     */
    handleInputChange(event: any, index: number) {
        let liste = this.state.liste;
        liste[index]["synonyme"] = event.target.value;
        liste[index]["saved"] = false;
        this.setState(liste);
    }

    /**
     * Sauvegarde d'un hashtag
     * @param index indice du hashtag à modifier
     */
    handleSaveChange(index: number) {
        // TODO save in DB
        let liste = this.state.liste;
        liste[index]["saved"] = true;
        this.setState(liste);
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
                            {this.state.liste.map((item: any, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        selected={item.saved}
                                        key={index}
                                    >
                                        <TableCell
                                            className={classNames(classes.cell, classes.hashtagCellWidth)}
                                            align="center">{item.entry}</TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.booleanCellWidth)}
                                            align="center"
                                        >
                                            <Checkbox
                                                name="articleToBeDeleted"
                                                color="primary"
                                                checked={item.articleToBeDeleted}
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
                                                checked={item.themeToBeDeleted}
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
                                                value={item.synonyme}
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
                                                disabled={item.saved}
                                                onClick={() => this.handleSaveChange(index)}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                                })
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Hashtag) as WithStyleComponent;
