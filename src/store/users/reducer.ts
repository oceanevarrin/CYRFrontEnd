import { Reducer } from "redux";
import { UsersState, UsersTypes, UsersActionTypes } from "./types";

const userInitialState: UsersState = {};

export const UsersReducer: Reducer<UsersState, UsersActionTypes> = (
  state = userInitialState,
  action
) => {
  switch (action.type) {
    case UsersTypes.forgotPassword:
    case UsersTypes.changePassword:
    case UsersTypes.resetPassword:
      return {
        ...state,
        [action.type]: {
          success: action.success,
          err: action.error,
          loading: false,
        },
      };

    case UsersTypes.START_LOADING:
      return {
        ...state,
        [action.id]: {
          loading: true,
        },
      };
    case UsersTypes.CLEAR_USER:
      return {
        ...state,
        [action.id]: {},
      };
    case UsersTypes.CLEAR_USERS:
      return {};
    default:
      return {
        ...state,
      };
  }
};
