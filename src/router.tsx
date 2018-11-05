import * as React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Hello from './hello/Hello.component';
import Register from './user/register/Register.components';
import Login from './user/login/Login.component';
import Article from './article/Article.component';

const Home = () => (<h2>Home</h2>);

const About = () => (<h2>About</h2>);

const routes = [
    {
        path: '/',
        label: 'Home',
        component: Home
    },
    {
        path: '/about',
        label: 'About',
        component: About
    },
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

const CustomLinkExample = () => (
    <Router>
        <div>
            {routes.map((route, i) => <MenuLink key={i} activeOnlyWhenExact={i === 0} to={route.path} label={route.label} />)}
            <hr />
            {routes.map((route, i) => <Route key={i} exact path={route.path} component={route.component} />)}
        </div>
    </Router>
);

const MenuLink = ({ label, to, activeOnlyWhenExact }: {label: string, to: string, activeOnlyWhenExact: boolean}) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <div className={match ? "active" : ""}>
                {match ? "> " : ""}
                <Link to={to}>{label}</Link>
            </div>
        )}
    />
);

export default CustomLinkExample;
