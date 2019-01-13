import store from "src/redux.services/index.store";
import { UserRight } from "./User.types";

export class UserService {

    isAuthenticated(): boolean {
        return store.getState().user.userRight === UserRight.BEARER;
    }

    getUserRight(): UserRight {
        return store.getState().user.userRight;
    }
}