interface IUser {
  data?: any;
  success?: boolean;
  error?: any;
  loading?: boolean;
}

export interface UsersState {
  forgotPassword?: IUser;
  changePassword?: IUser;
  resetPassword?: IUser;
}

export enum UsersTypes {
  forgotPassword = "forgotPassword",
  changePassword = "changePassword",
  resetPassword = "resetPassword",
  CLEAR_USER = "CLEAR_USER",
  CLEAR_USERS = "CLEAR_USERS",
  START_LOADING = "START_LOADING_USERS_DATA",
}

interface UsersActions {
  type:
    | typeof UsersTypes.forgotPassword
    | UsersTypes.changePassword
    | UsersTypes.resetPassword;
  success?: boolean;
  error?: any;
}
interface ClearUserAction {
  type: typeof UsersTypes.CLEAR_USER;
  id: string;
}
interface ClearUsersAction {
  type: typeof UsersTypes.CLEAR_USERS;
}
interface StartLoadingAction {
  type: typeof UsersTypes.START_LOADING;
  id: string;
}

export type UsersActionTypes =
  | UsersActions
  | ClearUserAction
  | StartLoadingAction
  | ClearUsersAction;
