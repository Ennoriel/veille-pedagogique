import { SAVE_USER_DATA, UserRight, LOGOUT, IUser } from "src/user/User.types";
import { SaveUserData, Logout } from "../action/user.action";

const defaultUser: IUser = {
    right: UserRight.NOT_AUTH
};

export default (state: IUser = defaultUser, action: SaveUserData | Logout) => {
    switch(action.type) {
        case SAVE_USER_DATA:
            return {
                ...state,
                ...action.payload.user,
                token: action.payload.token
            };
        case LOGOUT:
            return defaultUser;
    }
    return state;
}