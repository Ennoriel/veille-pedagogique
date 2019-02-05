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
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap' as 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

interface IInputProps {
    startAdornment: JSX.Element[];
    onChange: (event: any) => void;
    onKeyDown: (event: any) => void;
    placeholder: string;
}

interface IIInputProps {
    InputProps: IInputProps;
    classes: any;
    // ref: any;
    fullWidth: boolean;
    label: string;
}

function renderInput(inputProps: IIInputProps) {
    const { InputProps, classes, ...other } = inputProps;
  
    return (
        <TextField
            InputProps={{
                // inputRef: ref,
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
}

export interface Props {
    label: string;
    liste: string[];
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
        selectedItem: [],
    };
  
    handleKeyDown = (event: number) => {
        const { inputValue, selectedItem } = this.state;
        if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
            this.setState({
                selectedItem: selectedItem.slice(0, selectedItem.length - 1),
            });
        }
    };
  
    handleInputChange = (event: {target: {value: string}}) => {
        this.setState({ inputValue: event.target.value });
    };
  
    handleChange = (item: string) => {
        let { selectedItem } = this.state;
    
        if (selectedItem.indexOf(item) === -1) {
            selectedItem = [...selectedItem, item];
        }
    
        this.setState({
            inputValue: '',
            selectedItem,
        });

        this.props.handleRes(selectedItem);
    };
  
    handleDelete = (item: string) => () => {
        let selectedItemm = this.state.selectedItem;
        this.setState(state => {
            const selectedItem = [...selectedItemm];
            selectedItem.splice(selectedItem.indexOf(item), 1);
            return { selectedItem };
        });
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
