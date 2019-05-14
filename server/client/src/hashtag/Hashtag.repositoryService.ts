import axios from 'axios';
import { BASE_URI_SERVER } from '../shared/uri.constants';
import store from 'src/redux.services/index.store';
import { HashtagItem } from './Hashtag.type';

const URI_HASHTAGS = '/hashtag';

axios.defaults.baseURL = BASE_URI_SERVER;

/**
 * Service de réccupération des hashtags
 */
export class HashtagRepositoryService  {

    /**
     * Récupération des hastags non identifiés
     */
    public getHastags() {
        let config = {
            headers: {Authorization: store.getState().user.token}
        }
        return axios.get(URI_HASHTAGS, config);
    }

    /**
     * Save the modified hashtag
     */
    public saveHashtags(hashtag: HashtagItem) {
        let config = {
            headers: {Authorization: store.getState().user.token}
        }
        return axios.put(URI_HASHTAGS + '/' + hashtag._id, hashtag, config);
    }
}
