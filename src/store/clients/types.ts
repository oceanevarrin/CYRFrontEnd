export interface IClient{
  _id:string,
  first_name: string,
  last_name: string,
  email: string,
}

export interface ClientsState {
  clients: IClient[] | null;
  loading: boolean | null;
  error: any;
}

//auth action names
export enum ClientsTypes {
  CLIENTS_LOAD_SUCCESS = "CLIENTS_LOAD_SUCCESS",
  CLIENTS_LOAD_ERROR = "CLIENTS_LOAD_ERROR",
  CONTRACT_SIGN_SUCCESS = "CONTRACT_SIGN_SUCCESS",
  CONTRACT_SIGN_ERROR = "CONTRACT_SIGN_ERROR",
  LOGOUT = "LOGOUT",
}

//interface for action names
interface ClientsSuccessAction {
  type: typeof ClientsTypes.CLIENTS_LOAD_SUCCESS;
  payload: any;
}
interface ClientsLoadErrorAction {
  type: typeof ClientsTypes.CLIENTS_LOAD_ERROR;
  error: any;
}

interface ContractSuccessAction {
  type: typeof ClientsTypes.CONTRACT_SIGN_SUCCESS;
  payload: any;
}
interface ContractErrorAction {
  type: typeof ClientsTypes.CLIENTS_LOAD_ERROR;
  error: any;
}


interface LogoutAction {
  type: typeof ClientsTypes.LOGOUT;
}

export type ClientsActionTypes =
  | ClientsSuccessAction
  | ClientsLoadErrorAction
  | ContractErrorAction
  | ContractSuccessAction
  | LogoutAction
