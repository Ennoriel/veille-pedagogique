import * as React from "react";
import axios from 'axios';

import './Hello.css';

export interface Props {
    name: string;
    enthusiasmLevel: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

interface State {
    persons: Array<{name: string}>
}

// ({ name, enthusiasmLevel = 1, onIncrement, onDecrement }: Props)
class Hello extends React.Component<Props> {
    readonly state: State = {
        persons: []
      }

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
            })
      }

    render() {
        if (this.props.enthusiasmLevel <= 0) {
            throw new Error('You could be a little more enthusiastic. :D');
        }
      
        return (
            <div className="hello">
                <div className="greeting">
                    Hello {this.props.name + getExclamationMarks(this.props.enthusiasmLevel)}
                </div>
                <div className="button-group">
                    <button onClick={this.props.onDecrement}>-</button>
                    <button onClick={this.props.onIncrement}>+</button>
                </div>
                <ul>
                    { this.state.persons.map(person => <li>{person.name}</li>)}
                </ul>
            </div>
        );
    }
}

export default Hello;

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}