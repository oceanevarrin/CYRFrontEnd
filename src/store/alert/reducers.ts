import { Reducer } from 'redux';
import { AlertState, AlertTypes, AlertActionTypes } from './types';

export const alertInitialState: AlertState = [];
// interface Props {
//     state: AlertState;
//     action: AlertActionTypes;
// }
export const AlertReducer: Reducer<AlertState> = (state = alertInitialState, action:AlertActionTypes) => {
    
    switch (action.type) {
        case AlertTypes.SET_ALERT:
            return [...state, action.payload];
        case AlertTypes.REMOVE_ALERT:
            return state.filter((alert) => alert.id !== action.payload);
        case AlertTypes.CLEAR_ALERT:
                return [];
        default:
            return state;
    }
};
