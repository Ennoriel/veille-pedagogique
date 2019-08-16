import * as React from 'react';

import Home from '../home/Home.component';
import Register from '../user/register/Register.components';
import Login from '../user/login/Login.component';
import Article from '../article/Article.component';
import Hashtag from '../hashtag/Hashtag.component';
import Theme from '../theme/Theme.component';
import ThemeSearch from 'src/theme/ThemeSearch.component';

import HomeIcon from '@material-ui/icons/Home';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SubjectIcon from '@material-ui/icons/Subject';
import MemoryIcon from '@material-ui/icons/Memory';
import TuneIcon from '@material-ui/icons/Tune';
import { UserRight } from 'src/user/User.types';

export const DEFAULT_ROUTE = {
    path: '/accueil',
    label: 'Accueil',
}

export const routes = [
    {
        path: '/accueil',
        label: 'Accueil',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.NOT_AUTH,
            UserRight.BEARER_FREE,
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: Home,
        icon: <HomeIcon color="primary"/>
    },
    {
        path: '/creer-un-compte',
        label: 'Créer un nouveau compte',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Register,
        icon: <GroupAddIcon color="primary"/>
    },
    {
        path: '/authentification',
        label: 'Authentification',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.NOT_AUTH,
        ],
        component: Login,
        icon: <AccountCircleIcon color="primary"/>
    },
    {
        path: '/articles',
        label: 'Articles',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: Article,
        icon: <SubjectIcon color="primary"/>
    },
    {
        path: '/hashtags',
        label: 'Hashtags',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.SUPER_USER
        ],
        component: Hashtag,
        icon: <TuneIcon color="primary"/>
    },
    {
        path: '/themes',
        label: 'Thèmes',
        isDisplayedInMenu: true,
        userRights: [
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: ThemeSearch,
        icon: <MemoryIcon color="primary"/>
    },
    {
        path: '/themes/:theme',
        label: 'Thèmes',
        isDisplayedInMenu: false,
        userRights: [
            UserRight.BEARER_PREMIUM,
            UserRight.SUPER_USER
        ],
        component: Theme,
        icon: <MemoryIcon color="primary"/>
    }
]
