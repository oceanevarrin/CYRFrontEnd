import { Reducer } from "redux";
import { AuthActionTypes, AuthState, AuthTypes } from "./types";

export const authInitialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: null,
  loading: null,
  trialPeriod: null,
  isLawyer: null,
  error: null,
};

export const AuthReducer: Reducer<AuthState, AuthActionTypes> = (
  state = authInitialState,
  action
) => {
  switch (action.type) {
    case AuthTypes.AUTH_STARTED:
      return {
        ...state,
        loading: true,
      };
      case AuthTypes.RESET_PASSWORD_SUCCESS:
        return {
            ...state,
            loading: false,
            ...action.payload,
        };
      case AuthTypes.TRIAL_PERIOD_SUCCESS:
        return {
            ...state,
            loading: false,
            trialPeriod: action.payload,
        };
    case AuthTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        isAuthenticated: true,
      };
    case AuthTypes.USER_LOAD_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLawyer: action.isLawyer,
        loading: false,
      };
      case AuthTypes.TRIAL_PERIOD_FAIL:
        return {
            ...state,
            loading: false,
            error: action.error,
        };
    case AuthTypes.USER_LOAD_ERROR:
    case AuthTypes.RESET_PASSWORD_FAIL:
    case AuthTypes.REGISTER_FAIL:
    case AuthTypes.LOGIN_FAIL:
    case AuthTypes.LOGOUT:
      return {
        token: null,
        user: null,
        isAuthenticated: null,
        loading: false,
        isLawyer: null,
        trialPeriod: null,
        error: null,
      };
    default:
      return state;
  }
};
