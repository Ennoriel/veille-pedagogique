import axios from 'axios';
import { BASE_URI_SERVER } from '../shared/uri.constants';
import store from 'src/redux.services/index.store';

const URI_ARTICLES = '/article';
const URI_THEMES = '/theme';

axios.defaults.baseURL = BASE_URI_SERVER;

/**
 * Service de réccupération des articles
 */
export class ArticleRepositoryService  {

    /**
     * Réccupération des articles d'une page
     * @param articlePage numéro de la page suivante
     */
    public getArticles(articlePage: number) {
        let config = {
            headers: {Authorization: store.getState().user.token},
            params: { page: articlePage }
        }
        return axios.get(URI_ARTICLES, config);
    }

    public getThemes() {
        return axios.get(URI_THEMES, {headers: {Authorization: store.getState().user.token}});
    }
}