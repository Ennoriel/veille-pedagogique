import { Request, Response } from 'express';
import { ThemeModel } from './theme.types';

export class ThemeController {

    public getGraphThemes = (req: Request, res: Response) => {

        ThemeModel.aggregate(this.getGraphThemeQueryParam(req.params.theme))
                    .exec((err, themes) => {
                
            if(err){
                res.status(400).send(err);
                return;
            }

            res.json(themes);
        });
    }

    private getGraphThemeQueryParam(theme: String) {
        return [
            {
                '$match': {
                    'theme': theme
                }
            }, {
                '$graphLookup': {
                    'from': 'themes', 
                    'startWith': '$theme', 
                    'connectFromField': 'neighboors.node', 
                    'connectToField': 'theme', 
                    'as': 'node', 
                    'maxDepth': 1, 
                    'depthField': 'depth', 
                    'restrictSearchWithMatch': {
                        'neighboors.weight': {
                            '$gte': 4
                        }
                    }
                }
            }, {
                '$unwind': {
                    'path': '$node', 
                    'includeArrayIndex': 'index', 
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unwind': {
                    'path': '$node.neighboors', 
                    'includeArrayIndex': 'index_bis', 
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    'node.neighboors.weight': {
                    '$gte': 4
                    }
                }
            }, {
                '$project': {
                    '_id': 0,
                    'themeNodes': [
                        {
                            'id': '$node.theme',
                            'label': '$node.theme',
                            'labelProperty': '$node.theme',
                            'radius': '$node.neighboors.weight',
                            'size': '$node.neighboors.weight'
                        },
                        {
                            'id': '$node.neighboors.node',
                            'label': '$node.neighboors.node',
                            'labelProperty': '$node.theme',
                            'radius': '$node.neighboors.weight',
                            'size': '$node.neighboors.weight'
                        }
                    ],
                    'themeLinks': 
                        {
                            'source': '$node.theme',
                            'target': '$node.neighboors.node'
                        }
                    ,
                    // 'themeNodes': [
                    //     {
                    //         'id': '$node._id',
                    //         'label': '$node.theme',
                    //         'radius': '$node.neighboors.weight'
                    //     },
                    //     {
                    //         'id': '$node.neighboors._id',
                    //         'label': '$node.neighboors.node',
                    //         'radius': '$node.neighboors.weight'
                    //     }
                    // ],
                    // 'themeLinks': 
                    //     {
                    //         'source': '$node._id',
                    //         'target': '$node.neighboors._id'
                    //     }
                    // ,
                    // 'weight': '$node.neighboors.weight'
                }
            }
        ]
    }
}