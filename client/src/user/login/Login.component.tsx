
import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import { User } from '../User.types';
import { Grid, Button } from '@material-ui/core';
import { UserRepositoryService } from '../User.repositoryService';
import store from 'src/redux.services/index.store';
import { saveUserData } from 'src/redux.services/action/user.action';
import { Redirect } from 'react-router';
import { UserService } from '../User.service';
import { saveActiveRoute } from 'src/redux.services/action/route.action';
import ErrorDialog from 'src/shared/ErrorDialog.component';

export interface Props {
}

interface State {
    user: User,
    error: User,
    redirectToHello: boolean
    messageErreur: string
}

const ERREUR = 'o';
const OK = '';

let userRepositoryService: UserRepositoryService;
let userService: UserService;

/**
 * Composant permettant à un utilisateur de se connecter
 */
export default class Login extends React.Component<Props> {
    
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
            redirectToHello: userService.isAuthenticated(),
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
        })

        if(this.isRequiredTextOk(this.state.user.username) &&
                this.isPasswordOk(this.state.user.password)) {
            userRepositoryService.authenticate(this.state.user).then(value => {
                store.dispatch(saveUserData(value.data, value.headers.authorization));
                store.dispatch(saveActiveRoute({path: '/hello', label: "Hello"}));
                this.setState({"redirectToHello": true})
            }).catch(error => {
                this.setState({"messageErreur": error.response.data.message});
            });
        }
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
        if (this.state.redirectToHello) return <Redirect to="/hello"/>

        return (
            <div>
                <Grid container justify='center'>
                    <Grid item xs={8}>
                        <TextField
                            id="username"
                            label="Username"
                            name="username"
                            value={this.state.user.username}
                            onChange={this.handleInputChange}
                            required
                            error={this.state.error.username.length > 0}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            name="password"
                            error={this.state.error.password.length > 0}
                            value={this.state.user.password}
                            onChange={this.handleInputChange}
                            required
                            helperText="Just a reminder that we forced you to chose a 12 characters password ;)"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <Grid container spacing={16} justify='center'>
                            <Grid item>
                                <Button
                                    onClick={this.handleLoginClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary">
                                        login
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={this.handleResetClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary">
                                        empty fields
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
