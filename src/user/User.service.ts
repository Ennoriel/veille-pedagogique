import axios from 'axios';
import { BASE_URI_SERVER } from './../shared/uri.constants';
import { User } from './User.types';

const URI_USER = '/user';
const URI_USER_SLASH = URI_USER + '/';
const URI_USER_EXISTS_SLASH = URI_USER + '/exists/'
const URI_AUTHENTICATE = '/authenticate';

axios.defaults.baseURL = BASE_URI_SERVER;

export class UserService  {

    public getUsers() {
        return axios.get(URI_USER);
    }

    register(newUser: User) {
        return axios.post(URI_USER, newUser);
    }

    getUserById(_id: String) {
        return axios.get(URI_USER_SLASH + _id);
    }

    existsUser(username: String) {
        return axios.get(URI_USER_EXISTS_SLASH + username);
    }

    updateUser(_id: String, updatedUser: User) {
        return axios.post(URI_USER_SLASH + _id, updatedUser);
    }

    deleteUser(_id: String) {
        return axios.delete(URI_USER_SLASH + _id);
    }

    authenticate(user: User) {
        return axios.post(URI_AUTHENTICATE, user);
    }
    
}
