import { articleState } from '../constants/article.types';

const fakeArticleState = {
    1: {
        title: 'Projet Robotique - Innovation Pédagogique',
        url: 'https://www.youtube.com/watch?time_continue=84&v=riaWsQQew7E',
        language: 'fr',
        medium: 'video',
        date: new Date(1503180000000),
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae vulputate erat. Nunc viverra, ante at vulputate tempor, ex magna hendrerit elit, vel rutrum est velit a tellus. Praesent semper in dui non mattis. Sed id dapibus dolor, in suscipit mi. Vestibulum neque ex, dignissim sed iaculis id, tincidunt nec sem. Proin nec odio nec nulla gravida sollicitudin quis at dui. Nulla tellus massa, ultrices in justo id, dictum fermentum lectus. Nullam sapien nibh, elementum vitae metus sit amet, auctor sagittis risus.",
        themes: [
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
        description: "Vivamus condimentum metus arcu, dapibus finibus neque auctor a. Mauris in urna quam. Nunc vitae bibendum tellus. Ut pellentesque tempor orci sit amet ultrices. Duis ac vehicula ligula. Aliquam quis placerat tellus. Nullam ultricies semper urna, eu accumsan lectus hendrerit vitae. Maecenas et facilisis massa. Nam in risus libero. Donec ligula mi, fringilla quis interdum ac, facilisis porta odio. Quisque mauris lectus, malesuada vitae varius et, rhoncus sit amet lacus. Cras sapien orci, tempor eu feugiat ultrices, dictum sit amet erat.",
        themes: [
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
        description: "Pellentesque ullamcorper aliquam massa ullamcorper auctor. Donec diam odio, imperdiet vel dolor ac, dapibus blandit tortor. Sed sagittis feugiat libero. Suspendisse dapibus nisi non turpis dignissim sollicitudin. Morbi vestibulum molestie magna sit amet fringilla. Ut a nisi sit amet augue pretium porttitor a ac risus. Phasellus vitae nulla tristique, porttitor orci et, varius sapien. Suspendisse commodo purus quis velit lacinia viverra.",
        themes: [
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
        description: "In hac habitasse platea dictumst. Cras pharetra tellus sed diam ultricies posuere. Integer venenatis ligula et sem tristique lacinia. Praesent ornare lacinia ligula quis feugiat. Donec interdum ligula id magna ultricies, eget vestibulum sapien ornare. Donec nec pharetra ipsum, nec finibus urna. Donec elementum vel metus eget aliquet. Suspendisse ac dui ac lorem scelerisque luctus ut quis felis.",
        themes: [
            'modèle éducatif'
        ],
        siteInternet: 'educationrickshaw.com',
        auteur: 4
    }
}

export default (state: articleState = fakeArticleState, action: any) => {
    return state;
};