
import * as React from 'react';

import { User, EMAIL_REGEXP } from '../User.types';
import { Grid, Button, TextField, withStyles } from '@material-ui/core';
import { UserRepositoryService } from '../User.repositoryService';

import store from 'src/redux.services/index.store';
import { saveUserData } from 'src/redux.services/action/user.action';
import { saveActiveRoute } from 'src/redux.services/action/route.action';
import { Redirect } from 'react-router';

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
    usernameHelperText: string,
    redirectToHello: boolean
}

const ERREUR = 'o';
const OK = '';

let userRepositoryService: UserRepositoryService;

/**
 * Composant permettant à un utilisateur de s'enregistrer
 */
class Register extends React.Component<Props> {
    
    constructor (props: Props) {
        super (props);

        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
    
        this.handleInputChange = this.handleInputChange.bind(this);

        userRepositoryService = new UserRepositoryService;
    }

    /**
     * initialisation de l'état du composant
     */
    readonly state: State = {
        user : new User(),
        error: new User(),
        usernameHelperText: '',
        redirectToHello: false
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
                email : name == 'email' && this.isEmailOk(value) ? OK : this.state.error.email,
                lastname : name == 'lastname' && this.isRequiredTextOk(value) ? OK : this.state.error.lastname,
                password : name == 'password' && this.isPasswordOk(value) ? OK : this.state.error.password,
                passwordBis : name == 'passwordBis' && this.isPasswordBisOk(this.state.user.password, value) ? OK : 
                        name == 'password' && this.isPasswordBisOk(value, this.state.user.passwordBis) ? OK : this.state.error.passwordBis
            },
            usernameHelperText: this.isRequiredTextOk(value) ? '' : this.state.usernameHelperText
        });
    }

    /**
     * Méthode déclenchée au clic sur le bouton Register.
     * Gère l'enregistrement d'un nouvel utilisateur
     */
    async handleRegisterClick () {

        const isUsernameOk = this.isRequiredTextOk(this.state.user.username)
                            && await this.isUsernameOk(this.state.user.username);
        this.setState({usernameHelperText: isUsernameOk ? '' : 'Ce nom de username est déjà pris ou est vide.'})

        this.setState({
            error: {
                ...this.state.error,
                username : isUsernameOk ? OK : ERREUR,
                firstname : this.isRequiredTextOk(this.state.user.firstname) ? OK : ERREUR,
                lastname : this.isRequiredTextOk(this.state.user.lastname) ? OK : ERREUR,
                email : this.isEmailOk(this.state.user.email) ? OK : ERREUR,
                password : this.isPasswordOk(this.state.user.password) ? OK : ERREUR,
                passwordBis : this.isPasswordBisOk(this.state.user.password, this.state.user.passwordBis) ? OK : ERREUR
            }
        })

        if(isUsernameOk &&
                this.isRequiredTextOk(this.state.user.firstname) &&
                this.isRequiredTextOk(this.state.user.lastname) &&
                this.isEmailOk(this.state.user.email) &&
                this.isPasswordOk(this.state.user.password) &&
                this.isPasswordBisOk(this.state.user.password, this.state.user.passwordBis)) {
            userRepositoryService.register(this.state.user).then(value => {
                store.dispatch(saveUserData(value.data, value.headers.authorization));
                store.dispatch(saveActiveRoute({path: '/hello', label: "Hello"}));
                this.setState({"redirectToHello": true})
            }).catch(error => {
                this.setState({"messageErreur": error.response.data.message});
            });
        }
    }

    /**
     * Méthode de vérification de l'identifiant
     * @param username Username
     */
    private isUsernameOk = async (username: string) => await userRepositoryService.existsUser(username);

    /**
     * Méthode de vérification d'un champ recquis
     * @param text texte
     */
    private isRequiredTextOk = (text: string) => text.length > 0;

    /**
     * Méthode de vérification de l'email
     * @param email email
     */
    private isEmailOk = (email: string) => EMAIL_REGEXP.test(email);

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
            error: new User(),
            usernameHelperText: ''
        });
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirectToHello) return <Redirect to="/hello"/>
        
        return (
            <div className={classes.root}>
                <Grid container justify='center'>
                    <Grid item xs={10} lg={8}>
                        <Grid container justify='center'>
                            <Grid item xs={12} className={classes.gridInput}>
                                <TextField
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={this.state.user.username}
                                    onChange={this.handleInputChange}
                                    required
                                    error={this.state.error.username.length > 0}
                                    fullWidth
                                    helperText={this.state.usernameHelperText}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} className={classes.gridInput}>
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
                            </Grid>
                            <Grid item xs={12} lg={6} className={classes.gridInput}>
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
                            </Grid>
                            <Grid item xs={12} className={classes.gridInput}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    name="email"
                                    value={this.state.user.email}
                                    onChange={this.handleInputChange}
                                    required
                                    error={this.state.error.email.length > 0}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} lg={6} className={classes.gridInput}>
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
                            </Grid>
                            <Grid item xs={12} lg={6} className={classes.gridInput}>
                                <TextField
                                    id="passwordBis"
                                    type="password"
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
                            </Grid>
                            <Grid item className={classes.gridButton}>
                                <Button
                                    onClick={this.handleRegisterClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary"
                                    className={classes.buttonWidth}>
                                        register
                                </Button>
                            </Grid>
                            <Grid item className={classes.gridButton}>
                                <Button
                                    onClick={this.handleResetClick}
                                    variant="outlined" 
                                    size="large" 
                                    color="primary"
                                    className={classes.buttonWidth}>
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

export default withStyles(styles, { withTheme: true })(Register);
