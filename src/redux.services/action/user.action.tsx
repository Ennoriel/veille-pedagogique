import * as constants from '../../user/User.types'

export interface SaveUserData {
    type: constants.SAVE_USER_DATA,
    payload: constants.UserState
}

export function saveUserData(token: string): SaveUserData {
    return {
        type: constants.SAVE_USER_DATA,
        payload: {
            user: new constants.User(),
            token
        }
    }
}