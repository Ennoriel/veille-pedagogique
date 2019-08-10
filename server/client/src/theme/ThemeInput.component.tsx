import * as React from 'react';

import {
    withStyles,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import { ArticleRepositoryService } from 'src/article/Article.repositoryService';
import DownShiftMultipleComponent from 'src/shared/DownShiftMultiple.component';

const styles = (theme : any) => ({
});

interface Props {
    classes?: any;
    addNewItems: boolean;
    handleRes: ((liste: string[]) => never);
}

interface State {
    suggestions: Array<string>;
    selectedThemes: Array<string>;
}

let articleRepositoryService: ArticleRepositoryService;

/**
 * Composant d'un input Theme
 */
class ThemeInput extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        
        this.state = {
            suggestions: new Array<string>(),
            selectedThemes: new Array<string>(),
        };

        articleRepositoryService = new ArticleRepositoryService;

        this.getSuggestions();

        this.handleRes = this.handleRes.bind(this);
    }

    readonly state: State;

    /**
     * Initialise les suggestions de thèmes
     */
    getSuggestions() {
        articleRepositoryService.getThemes().then(themes => {
            this.setState({
                suggestions: themes.data
            });
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    handleRes(selectedThemes: Array<string>) {
        this.setState({
            selectedThemes
        })
        this.props.handleRes(selectedThemes)
    }

    render(): JSX.Element {
        return (
            <DownShiftMultipleComponent
                label="Thèmes"
                liste={this.state.suggestions}
                addNewItems={this.props.addNewItems}
                value={this.state.selectedThemes}
                handleRes={this.handleRes}
            />
        );
    }
}

export default withStyles(styles, { withTheme: true })(ThemeInput) as WithStyleComponent;
