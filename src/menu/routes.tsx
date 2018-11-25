import * as React from 'react';

import Hello from '../hello/Hello.component';
import Register from '../user/register/Register.components';
import Login from '../user/login/Login.component';
import Article from '../article/Article.component';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export const routes = [
    {
        path: '/hello',
        label: 'Hello',
        component: Hello,
        icon: <InboxIcon/>
    },
    {
        path: '/register',
        label: 'Register',
        component: Register,
        icon: <MailIcon/>
    },
    {
        path: '/login',
        label: 'Login',
        component: Login,
        icon: <InboxIcon/>
    },
    {
        path: '/articles',
        label: 'Articles',
        component: Article,
        icon: <MailIcon/>
    }
]