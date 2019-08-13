
import * as React from 'react';

import { User } from '../User.types';
import { Button, Grid, TextField, withStyles } from '@material-ui/core';
import { UserRepositoryService } from '../User.repositoryService';
import { store } from 'src/redux.services/index.store';
import { saveUserData } from 'src/redux.services/action/user.action';
import { UserService } from '../User.service';
import { saveActiveRoute } from 'src/redux.services/action/route.action';
import ErrorDialog from 'src/shared/ErrorDialog.component';
import { DEFAULT_ROUTE } from 'src/redux.services/reducers/route.reducer';
import { WithStyleComponent } from 'src/shared/standard.types';

const styles = (theme : any) => ({
    root: {
      flexGrow: 1,
    },
    buttonWidth: {
        width: '175px'
    },
    gridInput: {
        padding: "0 8px"
    },
    gridButton: {
        padding: "16px"
    }
});

export interface Props {
    classes?: any;
}

interface State {
    user: User,
    error: User,
    redirectToHome: boolean,
    messageErreur: string
}

const ERREUR = 'o';
const OK = '';

let userRepositoryService: UserRepositoryService;
let userService: UserService;

/**
 * Composant permettant à un utilisateur de se connecter
 */
class Login extends React.Component<Props> {
    
    constructor (props: Props) {
        super (props);

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
    
        this.handleInputChange = this.handleInputChange.bind(this);

        userRepositoryService = new UserRepositoryService;
        userService = new UserService;

        /**
         * initialisation de l'état du composant
         */
        this.state = {
            user : new User(),
            error: new User(),
            redirectToHome: userService.isAuthenticated(),
            messageErreur: ""
        };
    }

    /**
     * initialisation de l'état du composant
     */
    readonly state: State;
  
    /**
     * Gestion des valeurs et erreurs
     * @param event évènement de saisie
     */
    handleInputChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            user: {
                ...this.state.user,
                [name]: value
            },
            error: {
                ...this.state.error,
                username : name == 'username' && this.isRequiredTextOk(value) ? OK : this.state.error.username,
                password : name == 'password' && this.isPasswordOk(value) ? OK : this.state.error.password,
            }
        });
    }

    /**
     * Méthode déclenchée au clic sur le bouton Login.
     * Gère la connexion d'un nouvel utilisateur
     */
    handleLoginClick () {

        this.setState({
            error: {
                ...this.state.error,
                username : this.isRequiredTextOk(this.state.user.username) ? OK : ERREUR,
                password : this.isPasswordOk(this.state.user.password) ? OK : ERREUR,
            }
        }, () => {
            if(this.isRequiredTextOk(this.state.user.username) &&
                    this.isPasswordOk(this.state.user.password)) {
                userRepositoryService.authenticate(this.state.user).then(value => {
                    store.dispatch(saveUserData(value.data, value.headers.authorization));
                    store.dispatch(saveActiveRoute(DEFAULT_ROUTE));

                    /*
                     * Redirection to home is implied by the fact that a logon user
                     * is not allowed on this page
                     */
                })
                .catch(error => {
                    this.setState({"messageErreur": error.response.data.message});
                })
                ;
            }

        })
    }

    /**
     * Méthode de vérification d'un champ recquis
     * @param text texte
     */
    private isRequiredTextOk = (text: string) => text.length > 0;

    /**
     * Méthode de vérification du premier mot de passe
     * @param password mot de passe
     */
    private isPasswordOk = (password: string) => password.length >= 12;

    /**
     * Méthode déclenchée au clic sur le bouton 'Reset Fields'.
     * Réinitialisation du contexte de la page.
     */
    handleResetClick () {
        this.setState({
            user : new User(),
            error: new User()
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container justify='center'>
                    <Grid item xs={12} lg={8}>
                        <Grid container justify='center'>
                            <Grid item xs={12} className={classes.gridInput}>
                                <TextField
                                        id="username"
                                        label="Nom d'utilisateur"
                                        name="username"
                                        value={this.state.user.username}
                                        onChange={this.handleInputChange}
                                        required
                                        error={this.state.error.username.length > 0}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                            </Grid>
                            <Grid item xs={12} className={classes.gridInput}>
                                <TextField
                                    id="password"
                                    type="password"
                                    label="Mot de passe"
                                    name="password"
                                    error={this.state.error.password.length > 0}
                                    value={this.state.user.password}
                                    onChange={this.handleInputChange}
                                    required
                                    helperText="(est composé d'au moins 12 caractères)"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item className={classes.gridButton}>
                                <Button
                                    onClick={this.handleLoginClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary"
                                    className={classes.buttonWidth}>
                                        Se connecter
                                </Button>
                            </Grid>
                            <Grid item className={classes.gridButton}>
                                <Button
                                    onClick={this.handleResetClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary"
                                    className={classes.buttonWidth}>
                                        Réinitialiser les champs
                                </Button>
                            </Grid>
                        </Grid> 
                    </Grid>
                </Grid>
                <ErrorDialog
                    onClose={() => this.setState({"messageErreur": ""})}
                    message={this.state.messageErreur}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Login) as WithStyleComponent;
