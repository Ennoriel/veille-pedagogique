import * as React from 'react';

import Home from '../home/Home.component';
import Register from '../user/register/Register.components';
import Login from '../user/login/Login.component';
import Article from '../article/Article.component';

import HomeIcon from '@material-ui/icons/Home';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SubjectIcon from '@material-ui/icons/Subject';
import { UserRight } from 'src/user/User.types';

export const routes = [
    {
        path: '/home',
        label: 'Home',
        userRights: [
            UserRight.NOT_AUTH,
            UserRight.BEARER_FREE,
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: Home,
        icon: <HomeIcon/>
    },
    {
        path: '/register',
        label: 'Register',
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Register,
        icon: <GroupAddIcon/>
    },
    {
        path: '/login',
        label: 'Login',
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Login,
        icon: <AccountCircleIcon/>
    },
    {
        path: '/articles',
        label: 'Articles',
        userRights: [
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: Article,
        icon: <SubjectIcon/>
    }
]
