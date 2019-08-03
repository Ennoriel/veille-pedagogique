import * as React from 'react';

import {
    withStyles,
    Card,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import { nodeGraphItem, linkGraphItem } from './Theme.type';
import { 
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink
} from 'react-vis-force';

import { ThemeRepositoryService } from './Theme.repositoryService';

import * as _ from 'lodash'

const styles = (theme : any) => ({
    graph: {
        display: "block",
        margin: "auto"
    }
});

interface Props {
    themeCenter: string;
    classes?: any;
}

interface State {
    theme: string,
    themeNodes: Array<nodeGraphItem>,
    themeLinks: Array<linkGraphItem>
}

let themeRepositoryService: ThemeRepositoryService;

/**
 * Composant d'affichage du graph des thèmes associés
 */
class ThemeGraph extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        themeRepositoryService = new ThemeRepositoryService;

        this.state = {
            theme: this.props.themeCenter,
            themeNodes: [],
            themeLinks: []
        }

        this.loadThemeGraph();
    }

    loadThemeGraph() {
        themeRepositoryService.getThemeGraph(this.state.theme).then(value => {
            
            let themeNodes = value.data.map(node => node.themeNodes)
            let themeNodes2 = themeNodes.reduce((res, next) => {
                res.push(...next);
                return res;
            }, [])
            themeNodes2 = _.uniqBy(themeNodes2, function (e) {
                return e.id;
            });
            themeNodes2.forEach(element => {
                element.radius = 5 + element.radius
            })
            this.setState({
                themeNodes: themeNodes2,
                themeLinks: value.data.map(node => node.themeLinks)
            })
        }).catch(error => {
            // TODO gérer l'erreur
        });
    }

    readonly state: State;

    render() {
        const { classes } = this.props;

        return (
            <Card>
                <InteractiveForceGraph
                    className={classes.graph}
                    simulationOptions={{
                        animate: true,
                        strength: {
                            // collide: 3,
                            x: ({ radius }: { radius: number }) => 2 / radius,
                            y: ({ radius }: { radius: number }) => 2 / radius,
                        },
                        height: 400,
                        width: 400
                    }}
                    labelAttr="label"
                    onSelectNode={(node: any) => console.log(node)}
                    highlightDependencies
                    zoom
                    showLabels
                >
                    {
                        this.state.themeNodes.map((element, index) => (
                            <ForceGraphNode key={index} node={element} fill="red" />
                        ))
                    }
                    {
                        this.state.themeLinks.map((element, index) => (
                            <ForceGraphLink key={index} link={element} />
                        ))
                    } 
                </InteractiveForceGraph>
            </Card>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ThemeGraph) as WithStyleComponent;
