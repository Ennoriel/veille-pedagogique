import { SAVE_USER_DATA, UserRight, LOGOUT, IUser } from "src/user/User.types";
import { SaveUserData, Logout } from "../action/user.action";

const defaultUser: IUser = {
    userRight: UserRight.NOT_AUTH
};

export default (state: IUser = defaultUser, action: SaveUserData | Logout) => {
    switch(action.type) {
        case SAVE_USER_DATA:

            const userRight = action.payload.token === undefined ? UserRight.NOT_AUTH :
                action.payload.user.right === undefined ? UserRight.NOT_AUTH : 
                action.payload.user.right === "NOT_AUTHORIZED" ? UserRight.BEARER_0 :
                action.payload.user.right === "AUTHORIZED" ? UserRight.BEARER_1 : UserRight.SUPER_USER;
            console.log(action.payload.user)
            return {
                ...state,
                ...action.payload.user,
                token: action.payload.token,
                userRight
            };
        case LOGOUT:
            return defaultUser;
    }
    return state;
}