import * as React from 'react';

import {
    withStyles, TextField
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';

const styles = (theme : any) => ({});

export interface Props {
    value: number,
    handleInputChange: (date: number) => void;
}

export interface State {
    date: number
}

class DateField extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            date: this.props.value
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    readonly state: State;

    handleInputChange(event: any) {
        this.setState({
            date: parseInt(event.target.value)
        })
        this.props.handleInputChange(this.state.date)
    }
    
    render() {
        const {...other} = this.props
        
        return (
            <div>
                {this.state.date ? (
                        <TextField
                            type="date"
                            onChange={this.handleInputChange}
                            value={this.state.date}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            {...other}
                        />
                    )
                    :
                    (
                        <TextField
                            type="date"
                            onChange={this.handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            {...other}
                        />
                    )
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DateField) as WithStyleComponent;