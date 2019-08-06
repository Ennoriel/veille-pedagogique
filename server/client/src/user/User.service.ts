import { store } from "src/redux.services/index.store";
import { UserRight } from "./User.types";

export class UserService {

    getUserRight = (): UserRight => {
        return store.getState().user.right!;
    }

    isAuthenticated = (): boolean => {
        return [UserRight.BEARER_FREE, UserRight.BEARER_PREMIUM].includes(this.getUserRight());
    }
}