import * as constants from '../../user/User.types'

var jwt = require('jsonwebtoken');

export interface SaveUserData {
    type: constants.SAVE_USER_DATA,
    payload: constants.UserState
}

export interface Logout {
    type: constants.LOGOUT
}

export function saveUserData(user: constants.User, token: string): SaveUserData {

    const decipheredToken = jwt.decode(token);
    user._id = decipheredToken._id;

    return {
        type: constants.SAVE_USER_DATA,
        payload: {
            user,
            token
        }
    }
}

export function logout(): Logout {

    return {
        type: constants.LOGOUT,
    }
}
