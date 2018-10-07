import { EnthusiasmAction } from './index.actions';
import { StoreState } from './index.types';
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from './index.constants';

export function enthusiasm(state: StoreState, action: EnthusiasmAction): StoreState {
    switch (action.type) {
        case INCREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
        case DECREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
    }
    return state;
}