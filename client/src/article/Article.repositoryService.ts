import axios from 'axios';
import { BASE_URI_SERVER } from '../shared/uri.constants';
import store from 'src/redux.services/index.store';
import { IArticleCritere } from 'src/redux.services/constants/article.types';

const URI_ARTICLES = '/article';
const URI_THEMES = '/theme';

axios.defaults.baseURL = BASE_URI_SERVER;

/**
 * Service de réccupération des articles
 */
export class ArticleRepositoryService  {

    /**
     * Récupération des articles d'une page
     * @param article critere de recherche
     */
    public getArticles(article: IArticleCritere) {
        let config = {
            headers: {Authorization: store.getState().user.token},
            params: article
        }
        return axios.get(URI_ARTICLES, config);
    }

    /**
     * Récupération des thèmes disponibles
     */
    public getThemes() {
        return axios.get(URI_THEMES, {headers: {'Authorization': store.getState().user.token}});
    }
}