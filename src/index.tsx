import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Router from './router';

import store from './redux.services/index.store';

const render = () => {
    logState();
    return ReactDOM.render(<Router />,document.getElementById("root"));
};

render();

store.subscribe(render);

function logState() {
    console.log("%c Rendered with 👉 👉 👉 👉 👉 👇", "background: black; color: #fff");
    console.log(store.getState());
};