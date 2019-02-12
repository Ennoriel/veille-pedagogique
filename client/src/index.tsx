import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './menu/app.component';

import store from './redux.services/index.store';

const render = () => {
    logState();
    return ReactDOM.render(<App />,document.getElementById("root"));
};

render();

store.subscribe(render);

function logState() {
    console.log("%c LOG STATE", "background: black; color: #fff");
    console.log(store.getState());
};