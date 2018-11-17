import * as React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Hello from '../hello/Hello.component';
import Register from '../user/register/Register.components';
import Login from '../user/login/Login.component';
import Article from '../article/Article.component';
import Menu from './menu.component';

const routes = [
    {
        path: '/hello',
        label: 'Hello',
        component: Hello
    },
    {
        path: '/register',
        label: 'Register',
        component: Register
    },
    {
        path: '/login',
        label: 'Login',
        component: Login
    },
    {
        path: '/articles',
        label: 'Articles',
        component: Article
    }
]

const Page = () => (
    <Router>
        <div>
            <Menu routes={routes}/>
            <hr />
            {routes.map((route, i) => 
                <Route
                    key={i}
                    exact path={route.path}
                    component={route.component}
                />
            )}
        </div>
    </Router>
);

export default Page;
