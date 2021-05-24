export interface IUser {
  id:string,
  email:string,
  first_name:string,
  last_name:string,
  profile_built:boolean,
}

export interface AuthState {
  token: string | null;
  user: any;
  isAuthenticated: boolean | null;
  loading: boolean | null;
  isLawyer: boolean | null;
  error: any;
  trialPeriod: number | null;
}

//auth action names
export enum AuthTypes {
  GET_EARLY_ACCESS = "GET_EARLY_ACCESS",
  RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL',
  GET_EARLY_ACCESS_FAIL = "GET_EARLY_ACCESS_FAIL",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAIL = "REGISTER_FAIL",
  USER_LOAD_SUCCESS = "USER_LOAD_SUCCESS",
  USER_LOAD_ERROR = "USER_LOAD_ERROR",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  TRIAL_PERIOD_SUCCESS = "TRIAL_PERIOD_SUCCESS",
  TRIAL_PERIOD_FAIL = "TRIAL_PERIOD_FAIL",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
  AUTH_STARTED = "AUTH_STARTED",
}

//interface for action names

interface ResetSuccessAction {
  type: typeof AuthTypes.RESET_PASSWORD_SUCCESS;
  payload: any;
}

interface ResetFailureAction {
  type: typeof AuthTypes.RESET_PASSWORD_FAIL;
  error?: any;
}

interface TrialPeriodSuccessActions {
  type: typeof AuthTypes.TRIAL_PERIOD_SUCCESS;
  payload: any;
}

interface TrialPeriodFailActions {
  type: typeof AuthTypes.TRIAL_PERIOD_FAIL;
  error?: any;
}

interface GetEarlyAccessAction {
  type: typeof AuthTypes.GET_EARLY_ACCESS;
  payload: any;
}
interface LoginSuccessAction {
  type: typeof AuthTypes.LOGIN_SUCCESS;
  payload: {
    user: any;
    token: string;
    isLawyer: boolean;
  };
}
interface UserLoadAction {
  type: typeof AuthTypes.USER_LOAD_SUCCESS;
  payload: any;
  isLawyer: boolean;
}
interface RegisterFailAction {
  type: typeof AuthTypes.REGISTER_FAIL;
  error: any;
}
interface LoginFailAction {
  type: typeof AuthTypes.LOGIN_FAIL;
  error: any;
}
interface UserLoadErrorAction {
  type: typeof AuthTypes.USER_LOAD_ERROR;
  error: any;
}
interface LogoutAction {
  type: typeof AuthTypes.LOGOUT;
}
interface AuthStartedAction {
  type: typeof AuthTypes.AUTH_STARTED;
}

export type AuthActionTypes =
  | ResetSuccessAction
  | ResetFailureAction
  | TrialPeriodFailActions
  | TrialPeriodSuccessActions
  | RegisterFailAction
  | LoginSuccessAction
  | LoginFailAction
  | UserLoadAction
  | UserLoadErrorAction
  | LogoutAction
  | AuthStartedAction
  | GetEarlyAccessAction;
