import * as React from 'react';

import Home from '../home/Home.component';
import Register from '../user/register/Register.components';
import Login from '../user/login/Login.component';
import Article from '../article/Article.component';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { UserRight } from 'src/user/User.types';

export const routes = [
    {
        path: '/home',
        label: 'Home',
        userRights: [
            UserRight.NOT_AUTH,
            UserRight.BEARER_0,
            UserRight.BEARER_1,
            UserRight.SUPER_USER
        ],
        component: Home,
        icon: <InboxIcon/>
    },
    {
        path: '/register',
        label: 'Register',
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Register,
        icon: <MailIcon/>
    },
    {
        path: '/login',
        label: 'Login',
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Login,
        icon: <InboxIcon/>
    },
    {
        path: '/articles',
        label: 'Articles',
        userRights: [
            UserRight.BEARER_1,
            UserRight.SUPER_USER
        ],
        component: Article,
        icon: <MailIcon/>
    }
]
