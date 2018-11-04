import { articleState } from '../constants/article.types';

const fakeArticleState = {
    1: {
        title: 'Projet Robotique - Innovation Pédagogique',
        url: 'https://www.youtube.com/watch?time_continue=84&v=riaWsQQew7E',
        language: 'fr',
        medium: 'video',
        date: new Date(1503180000000),
        theme: [
            'pédagogie par projet',
            'robotique',
            'prix de l\'innovation pédagogique'
        ],
        siteInternet: 'www.youtube.com',
        auteur: 1
    },
    2: {
        title: 'Les "cours de bonheur" font leur arrivée dans les écoles indiennes',
        url: 'https://www.huffingtonpost.fr/2018/07/30/les-cours-de-bonheur-font-leur-arrivee-dans-les-ecoles-indiennes_a_23492345/?utm_hp_ref=fr-international',
        language: 'fr',
        medium: 'article presse',
        date: new Date(1532901600000),
        theme: [
            'bonheur'
        ],
        siteInternet: 'www.huffingtonpost.fr',
        auteur: 2
    },
    3: {
        title: 'Le tableau SVA : un outil d’apprentissage centré sur les élèves',
        url: 'http://apprendre-reviser-memoriser.fr/le-tableau-sva/?utm_source=dlvr.it&utm_medium=twitter',
        language: 'fr',
        medium: 'article blog',
        date: new Date(1533765600000),
        theme: [
            'outil',
            'efforts'
        ],
        siteInternet: 'apprendre-reviser-memoriser.fr',
        auteur: 3
    },
    4: {
        title: 'After 100 Years of the Same Teaching Model It’s Time to Throw Out the Playbook',
        url: 'https://educationrickshaw.com/2017/12/02/after-100-years-of-the-same-teaching-model-its-time-to-throw-out-the-playbook/amp/',
        language: 'en',
        medium: 'article blog',
        date: new Date(1512169200000),
        theme: [
            'modèle éducatif'
        ],
        siteInternet: 'educationrickshaw.com',
        auteur: 4
    }
}

export default (state: articleState = fakeArticleState, action: any) => {
    return state;
};