import axios from 'axios';
import { BASE_URI_SERVER } from '../shared/uri.constants';
import { store } from 'src/redux.services/index.store';
import { HashtagItem } from './Hashtag.type';

const URI_HASHTAGS = '/hashtag';

axios.defaults.baseURL = BASE_URI_SERVER;

/**
 * Service de récupération des hashtags
 */
export class HashtagRepositoryService  {

    /**
     * Récupération des hastags non identifiés
     * @param indexed whether indexed themes should be retrieved
     * @param notIndexed whether not yet indexed themes should be retrieved
     */
    public getHastags(indexed: boolean, notIndexed: boolean) {
        let config = {
            headers: {Authorization: store.getState().user.token},
            params: {
                indexed,
                notIndexed
            }
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
