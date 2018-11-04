import * as React from "react";
import axios from 'axios';
import helloService from './hello.service';

import './Hello.component.css';

export interface Props {
    name: string;
    enthusiasmLevel: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

interface State {
    persons: Array<{name: string}>,
    personsAfterClick: Array<{name: string}>,
    isToggleOn: boolean
}

// ({ name, enthusiasmLevel = 1, onIncrement, onDecrement }: Props)
class Hello extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handlePersonClick = this.handlePersonClick.bind(this);
    }
    
    readonly state: State = {
        persons: [],
        personsAfterClick: [],
        isToggleOn: true
    };

    handleClick() {
        this.setState(state => ({
            isToggleOn: !this.state.isToggleOn
        }));
    }

    handlePersonClick() {
        helloService().then(
            res => {
                this.setState({ personsAfterClick : res.data });
            }
        )
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
                    { this.state.persons.map((person, i) => <li key={i}>{person.name}</li>)}
                </ul>
                <div className="button-group">
                    <button onClick={this.handleClick}>
                        {this.state.isToggleOn ? 'ON' : 'OFF'}
                    </button>
                </div>
                <div className="button-group">
                    <button onClick={this.handlePersonClick}>
                        Chargez des données
                    </button>
                </div>
                <ul>
                    { this.state.personsAfterClick.map((person, i) => <li key={i}>{person.name}</li>)}
                </ul>
            </div>
        );
    }
}

export default Hello;

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}