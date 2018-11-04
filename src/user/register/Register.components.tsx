
import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import { User } from '../User.types';
import { Grid, Button } from '@material-ui/core';
import { UserService } from '../User.service';

export interface Props {
}

interface State {
    user: User,
    error: User
}

const ERREUR = 'o';
const OK = '';

let userService: UserService;

/**
 * Composant permettant à un utilisateur de s'enregistrer
 */
export default class Register extends React.Component<Props> {
    
    constructor (props: Props) {
        super (props);

        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
    
        this.handleInputChange = this.handleInputChange.bind(this);

        userService = new UserService;
    }

    /**
     * initialisation de l'état du composant
     */
    readonly state: State = {
        user : new User(),
        error: new User()
    };
  
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
                firstname : name == 'firstname' && this.isRequiredTextOk(value) ? OK : this.state.error.firstname,
                lastname : name == 'lastname' && this.isRequiredTextOk(value) ? OK : this.state.error.lastname,
                password : name == 'password' && this.isPasswordOk(value) ? OK : this.state.error.password,
                passwordBis : name == 'passwordBis' && this.isPasswordBisOk(this.state.user.password, value) ? OK : 
                        name == 'password' && this.isPasswordBisOk(value, this.state.user.passwordBis) ? OK : this.state.error.passwordBis
            }
        });
    }

    /**
     * Méthode déclenchée au clic sur le bouton Register.
     * Gère l'enregistrement d'un nouvel utilisateur
     */
    handleRegisterClick () {

        this.setState({
            error: {
                ...this.state.error,
                username : this.isRequiredTextOk(this.state.user.username) ? OK : ERREUR,
                firstname : this.isRequiredTextOk(this.state.user.firstname) ? OK : ERREUR,
                lastname : this.isRequiredTextOk(this.state.user.lastname) ? OK : ERREUR,
                password : this.isPasswordOk(this.state.user.password) ? OK : ERREUR,
                passwordBis : this.isPasswordBisOk(this.state.user.password, this.state.user.passwordBis) ? OK : ERREUR
            }
        })

        if(this.isUsernameOk(this.state.user.username) &&
                this.isRequiredTextOk(this.state.user.firstname) &&
                this.isRequiredTextOk(this.state.user.lastname) &&
                this.isPasswordOk(this.state.user.password) &&
                this.isPasswordBisOk(this.state.user.password, this.state.user.passwordBis)) {
            userService.register(this.state.user);
        }
    }

    /**
     * Méthode de vérification de l'identifiant
     * TODO : implémentation de la recherche de l'existence du username
     * @param username Username
     */
    private isUsernameOk = (username: string) => true;

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
     * Méthode de vérification du deuxième mot de passe
     * @param password premier mot de passe
     * @param passwordBis deuxième mot de passe
     */
    private isPasswordBisOk = (password: string, passwordBis: string) => password === passwordBis;

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
        return (
            <div>
                <h1>
                    Register
                </h1>
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
                            id="firstname"
                            label="Firstname"
                            name="firstname"
                            value={this.state.user.firstname}
                            onChange={this.handleInputChange}
                            required
                            error={this.state.error.firstname.length > 0}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            id="lastname"
                            label="Lastname"
                            name="lastname"
                            value={this.state.user.lastname}
                            onChange={this.handleInputChange}
                            required
                            error={this.state.error.lastname.length > 0}
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
                            helperText="Please write a minimum of 12 characters."
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            id="passwordBis"
                            label="Password"
                            name="passwordBis"
                            error={this.state.error.passwordBis.length > 0}
                            value={this.state.user.passwordBis}
                            onChange={this.handleInputChange}
                            required
                            helperText="Should (obviously) be the same."
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <Grid container spacing={16} justify='center'>
                            <Grid item>
                                <Button
                                    onClick={this.handleRegisterClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary">
                                        register
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
            </div>
        );
    }
}
