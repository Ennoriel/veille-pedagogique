import { SAVE_USER_DATA } from "src/user/User.types";

export default (state = {}, action: any) => {
    switch(action.type) {
        case SAVE_USER_DATA:
            return {
                ...state,
                ...action.payload.user,
                token: action.payload.token
            };
    }
    return state;
}