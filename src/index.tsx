import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { enthusiasm } from './redux.services/index.reducers';
import { StoreState } from './redux.services/index.types';

import Router from './router';
import { Provider } from 'react-redux';

const store = createStore<StoreState, any, any, any>(enthusiasm, {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
});

ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>,
    document.getElementById('root') as HTMLElement
);