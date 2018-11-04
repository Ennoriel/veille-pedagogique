import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from "../constants/enthusiasm.types";
import { EnthusiasmAction } from "../action/enthusiasm.action";

const enthusiasm = {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
}

export default (state: any = enthusiasm, action: EnthusiasmAction) => {
    switch (action.type) {
        case INCREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + action.payload.amount };
        case DECREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - action.payload.amount) };
    }
    return state;
};