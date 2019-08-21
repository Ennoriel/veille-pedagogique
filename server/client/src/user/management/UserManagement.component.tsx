import * as React from 'react';

import {
    withStyles,
    Grid,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    // Checkbox,
    IconButton,
    Select,
    MenuItem,
} from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';

import { WithStyleComponent } from 'src/shared/standard.types';
import classNames from 'classnames';

import { UserRepositoryService } from '../User.repositoryService';
import { User, UserRight } from '../User.types';

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
    listeUser: Array<User & {saved: boolean}>
}

let userRepositoryService: UserRepositoryService;

/**
 * Composant d'affichage des hastags
 */
class UserManagement extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        userRepositoryService = new UserRepositoryService;

        this.state = { listeUser: [] };
        
        userRepositoryService.getUsers().then(value => {
            this.setState({ listeUser: value.data })
        }).catch(error => {
            // TODO gérer l'erreur
        });

        this.handleUserRight = this.handleUserRight.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
    }

    readonly state: State;

    handleUserRight(event: any, index: number){
        let liste = this.state.listeUser;
        liste[index]["right"] = event.target.value;
        this.setState({"listeUser": liste});
    }

    handleSaveChange(index: number) {

        let listeUser = this.state.listeUser;
        let user = listeUser[index];

        userRepositoryService.updateUser(user._id, user);
        listeUser[index]["saved"] = true;
        this.setState({"listeUser": listeUser});
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
                                    align="center">Nom d'utilisateur</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Prénom</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.booleanCellWidth)}
                                    align="center">Nom</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.synonymeCellWidth)}
                                    align="center">Email</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.synonymeCellWidth)}
                                    align="center">Droit</TableCell>
                                <TableCell
                                    className={classNames(classes.cell, classes.actionCellWidth)}
                                    align="center">Sauvegrader</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.listeUser.map((user: User & {saved: boolean}, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        // selected={hashtag.saved}
                                        key={index}
                                    >
                                        <TableCell
                                            className={classNames(classes.cell, classes.hashtagCellWidth)}
                                            align="center"
                                        >
                                            {user.username}
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.booleanCellWidth)}
                                            align="center"
                                        >
                                            {user.firstname}
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.booleanCellWidth)}
                                            align="center"
                                        >
                                            {user.lastname}
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.synonymeCellWidth)}
                                            align="center"
                                        >
                                            {user.email}
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.synonymeCellWidth)}
                                            align="center"
                                        >
                                            <Select
                                                name="right"
                                                onChange={(event) => this.handleUserRight(event, index)}
                                                margin="dense"
                                                variant="outlined"
                                                value={user.right}
                                            >
                                                {
                                                    Object.values(UserRight).map((right, index) => 
                                                        <MenuItem key={index} value={right}>{right}</MenuItem>
                                                    )
                                                }
                                            </Select>
                                        </TableCell>
                                        <TableCell
                                            className={classNames(classes.cell, classes.actionCellWidth)}
                                            align="center"
                                        >
                                            <IconButton
                                                key={index}
                                                disabled={user.saved}
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

export default withStyles(styles, { withTheme: true })(UserManagement) as WithStyleComponent;
