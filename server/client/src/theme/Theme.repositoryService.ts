import axios, { AxiosPromise } from 'axios';
import { BASE_URI_SERVER } from '../shared/uri.constants';
import { store } from 'src/redux.services/index.store';
import { ThemeGraphItem } from './Theme.type';

const URI_THEMEGRAPH = '/themeGraph/';

axios.defaults.baseURL = BASE_URI_SERVER;

/**
 * Service de récupération des themes
 */
export class ThemeRepositoryService  {

    /**
     * Récupération du graphe d'un thème
     */
    public getThemeGraph (theme: String): AxiosPromise<Array<ThemeGraphItem>> {
        let config = {
            headers: {Authorization: store.getState().user.token}
        }
        return axios.get(URI_THEMEGRAPH + theme, config);
    }
}
