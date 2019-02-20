import { SAVE_USER_DATA, UserRight, LOGOUT, IUser } from "src/user/User.types";
import { SaveUserData, Logout } from "../action/user.action";

const defaultUser: IUser = {
    userRight: UserRight.NOT_AUTH
};

const superUser: IUser = {
	email: 'azer@azer.azer',
	firstname: 'azer',
	lastname: 'azer',
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzNhNDgyZjAzZTIxZjE4NTk2MDU4MTciLCJpYXQiOjE1NTA0MjUxODd9.AcTIfjujcxlLcVydtwIHGkTiXeJv5ND6zMUzt1i-I74',
	userRight: UserRight.SUPER_USER,
	username: 'azerazerazer',
	_id: '5c3a482f03e21f1859605817'
}

export default (state: IUser = superUser, action: SaveUserData | Logout) => {
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