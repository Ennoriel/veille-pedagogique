import * as React from 'react';
import * as keycode from 'keycode';
import Downshift from 'downshift';
import { TextField, Chip, Paper, MenuItem, withStyles } from '@material-ui/core';
import * as _ from 'lodash';
import { WithStyleComponent } from './standard.types';

const styles = (theme : any) => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative' as 'relative',
    },
    paper: {
        position: 'absolute' as 'absolute',
        zIndex: 2,
        marginTop: theme.spacing.unit(1),
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit(1) / 2}px ${theme.spacing.unit(1) / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap' as 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit(2),
    },
});

interface IInputProps {
    InputProps: {
        startAdornment: JSX.Element[];
        onChange: (event: any) => void;
        onKeyDown: (event: any) => void;
        placeholder: string;
    }
    classes: any;
    fullWidth: boolean;
    label: string;
}

/**
 * Gestion de l'affichage de l'input
 */
function renderInput(inputProps: IInputProps) {
    const { InputProps, classes, ...other } = inputProps;
  
    return (
        <TextField
            InputProps={{
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
            variant='outlined'
            margin="normal"
        />
    );
}

/**
 * Renvoie la liste des suggestions
 * @param liste 
 * @param value 
 */
function getSuggestions(liste: string[], value: string | null) {
    const inputValue = _.deburr((value == null ? '' : value).trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : liste.filter(suggestion => {
            const keep =
                count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;
    
            if (keep) {
                count += 1;
            }
    
            return keep;
        });
}

/**
 * Gestion de l'affichage d'une suggestion
 */
function renderSuggestion(
    { listeItem, index, itemProps, highlightedIndex, selectedItem } :
    { listeItem: string, index: number, itemProps: object, highlightedIndex: number | null, selectedItem: string}
) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(listeItem) > -1;
  
    return (
        <MenuItem
            {...itemProps}
            key={listeItem}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {listeItem}
        </MenuItem>
    );
}

interface State {
    inputValue: string;
    selectedItem: string[];
    isManualAddingEnabled: boolean;
}

export interface Props {
    label: string;
    liste: string[];
    value: string[];
    addNewItems: boolean
    handleRes: ((liste: string[]) => never);
    classes?: any;
}

class DownshiftMultiple extends React.Component<Props> {

    constructor (props: Props) {
        super (props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    readonly state: State = {
        inputValue: '',
        selectedItem: this.props.value || [],
        isManualAddingEnabled: true
    };
  
    /**
     * Gestion de la suppression d'un élément par la touche "suppr" du clavier
     */
    handleKeyDown = (event: number) => {
        const { inputValue } = this.state;
        let { selectedItem } = this.state;

        /**
         * Si la touche haut ou bas est appuyé, on n'autorise plus la saisie manuelle
         * pour prévenir l'enregistrement de la saisie utilisateur et d'un item de la liste
         */ 
        if(keycode(event) === 'down' || keycode(event) === 'up') {
            this.setState({
                isManualAddingEnabled: false
            })
        }

        if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {

            let selectedItemFinal = selectedItem.slice(0, selectedItem.length - 1)

            this.setState({
                selectedItem: selectedItemFinal,
                isManualAddingEnabled: true
            });

            this.props.handleRes(selectedItemFinal);

        } else if (this.props.addNewItems && this.state.isManualAddingEnabled
                    && inputValue.length && keycode(event) === 'enter') {

            if (selectedItem.indexOf(inputValue) === -1) {
                selectedItem = [...selectedItem, inputValue];
            }

            this.setState({
                inputValue: '',
                selectedItem,
            });
            this.props.handleRes(this.state.selectedItem);
        }
    };
  
    /**
     * Gestion de la saisie utilisateur
     */
    handleInputChange = (event: {target: {value: string}}) => {
        this.setState({ inputValue: event.target.value });
    };
  
    /**
     * Gestion de l'ajout d'un élément de la liste
     */
    handleChange = (item: string) => {
        let { selectedItem } = this.state;
    
        if (selectedItem.indexOf(item) === -1) {
            selectedItem = [...selectedItem, item];
        }
    
        this.setState({
            inputValue: '',
            selectedItem,
            isManualAddingEnabled: true
        });

        this.props.handleRes(selectedItem);
    };
  
    /**
     * Gestion de la suppression d'un élément de la liste
     */
    handleDelete = (item: string) => () => {
        let selectedItem = this.state.selectedItem;

        selectedItem.splice(selectedItem.indexOf(item), 1);

        this.setState({
            selectedItem,
            isManualAddingEnabled: true
        });
        this.props.handleRes(selectedItem);
    };
  
    render() {
        const { liste, classes } = this.props;
        const { inputValue, selectedItem } = this.state;
    
        return (
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={this.handleChange}
                selectedItem={selectedItem}
            >
                {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue: inputValue2,
                    selectedItem: selectedItem2,
                    highlightedIndex,
                }) => (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: getInputProps({
                                startAdornment: selectedItem.map(item => (
                                    <Chip
                                        key={item}
                                        tabIndex={-1}
                                        label={item}
                                        className={classes.chip}
                                        onDelete={this.handleDelete(item)}
                                    />
                                )),
                                onChange: this.handleInputChange,
                                onKeyDown: this.handleKeyDown,
                                placeholder: this.props.label,
                            }),
                            label: this.props.label,
                        })}
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                {getSuggestions(liste, inputValue2).map((listeItem: string, index: number) =>
                                    renderSuggestion({
                                        listeItem,
                                        index,
                                        itemProps: getItemProps({ item: listeItem }),
                                        highlightedIndex,
                                        selectedItem: selectedItem2,
                                    })
                                )}
                            </Paper>
                        ) : null}
                    </div>
                )}
            </Downshift>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DownshiftMultiple) as WithStyleComponent;
