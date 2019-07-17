import * as React from 'react';

import {
    withStyles,
    Grid,
    Card,
} from '@material-ui/core';

import { WithStyleComponent } from 'src/shared/standard.types';
import { nodeGraphItem, linkGraphItem } from './Theme.type';
import { 
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink
} from 'react-vis-force';

// import { Graph } from 'react-d3-graph';

import { ThemeRepositoryService } from './Theme.repositoryService';

import * as _ from 'lodash'

const styles = (theme : any) => ({
});

interface Props {
    classes?: any;
}

interface State {
    themeNodes: Array<nodeGraphItem>,
    themeLinks: Array<linkGraphItem>
}

let themeRepositoryService: ThemeRepositoryService;

/**
 * Composant d'affichage des thèmes
 */
class ThemeGraph extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        themeRepositoryService = new ThemeRepositoryService;

        this.state = {
            themeNodes: [],
            themeLinks: []
        }

        this.loadThemeGraph();
    }

    loadThemeGraph() {
        themeRepositoryService.getThemeGraph('Education').then(value => {
            
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
            // let themeLinks = value.data.map(node => node.themeLinks);
            // themeLinks = themeLinks.reduce((res, next) => {
            //     if ()
            //     return res;
            // }, [])
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
        return (
            <Grid container justify='center'>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <InteractiveForceGraph
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
                    <Card>
                        {/* <Graph
                            data={{
                                nodes: this.state.themeNodes,
                                links: this.state.themeLinks,
                            }}
                        /> */}
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ThemeGraph) as WithStyleComponent;
