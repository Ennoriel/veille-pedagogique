import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './menu/app.component';

import { store, persistor } from './redux.services/index.store';

import { PersistGate } from 'redux-persist/lib/integration/react';

const render = () => {
    logState();
    return ReactDOM.render(
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        ,document.getElementById("root"));
};

render();

store.subscribe(render);

function logState() {
    if(process.env.ENV === 'development') {
        console.log("%c LOG STATE", "background: black; color: #fff");
        console.log(store.getState());
    }
};
