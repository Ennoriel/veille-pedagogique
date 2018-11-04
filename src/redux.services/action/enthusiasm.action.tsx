import * as constants from '../constants/enthusiasm.types'

export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM,
    payload: {
        amount: number
    };
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM,
    payload: {
        amount: number
    };
}

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

export function incrementEnthusiasm(amount = 1): IncrementEnthusiasm {
    return {
        type: constants.INCREMENT_ENTHUSIASM,
        payload: {
            amount
        }
    }
}

export function decrementEnthusiasm(amount = 1): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM,
        payload: {
            amount
        }
    }
}