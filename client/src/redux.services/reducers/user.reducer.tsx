import { SAVE_USER_DATA, UserRight } from "src/user/User.types";

const defaultUser = {
    userRight: UserRight.NOT_AUTH
};

export default (state = defaultUser, action: any) => {
    switch(action.type) {
        case SAVE_USER_DATA:
            return {
                ...state,
                ...action.payload.user,
                token: action.payload.token,
                userRight: action.payload.token === undefined ? UserRight.NOT_AUTH : UserRight.BEARER
            };
    }
    return state;
}