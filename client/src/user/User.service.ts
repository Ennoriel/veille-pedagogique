import store from "src/redux.services/index.store";
import { UserRight } from "./User.types";

export class UserService {

    getUserRight = (): UserRight => {
        return store.getState().user.userRight;
    }

    isAuthenticated = (): boolean => {
        return [UserRight.BEARER_0, UserRight.BEARER_1].includes(this.getUserRight());
    }
}