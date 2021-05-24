import { IProfile } from "../profile/types";

export interface ISearch {
  location: string;
  legalfields: string;
  lawyerLanguages: string;
  lawyerServices: string;
}

export interface IContract {
  _id: string;
  contract_title: string;
  lawyer: string;
  payment_amount: number;
  client_agreed: string;
  lawyer_agreed: string;
  status: string;
  // deadline : Date;
}

export interface Profile {
  _id: string;
  clients: [];
  rating: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ILawyer {
  lawyer: Profile;
  legal_fields: string[];
}

export interface IAllLawyers {
  _id: string;
  clients: [];
  rating: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_built: boolean;
  role: string;
  status: string;
  approval_requested: boolean;
}

export interface LawyersState {
  lawyers: ILawyer[] | null;
  allLawyers: IAllLawyers[] | null;
  sarchResults: ILawyer[] | null;
  selectedLawyer: ILawyer | null;
  selectedProfile: IProfile | null;
  contracts: IContract[] | null;
  profilePicture: any | null;
  loading: boolean | null;
  searchKey: ISearch | null;
  error: any;
}

//auth action names
export enum LawyersTypes {
  LAWYERS_LOAD_SUCCESS = "LAWYERS_LOAD_SUCCESS",
  LAWYERS_LOAD_ERROR = "LAWYERS_LOAD_ERROR",
  CONTRACTS_LOAD_SUCCESS = "CONTRACTS_LOAD_SUCCESS",
  CONTRACTS_LOAD_ERROR = "CONTRACTS_LOAD_ERROR",
  PICTURE_LOAD_SUCCESS = "PICTURE_LOAD_SUCCESS",
  PICTURE_LOAD_ERROR = "PICTURE_LOAD_ERROR",
  SELECTED_LAWYER_LOAD_SUCCESS = "SELECTED_LAWYER_LOAD_SUCCESS",
  SELECTED_LAWYER_LOAD_ERROR = "SELECTED_LAWYER_LOAD_ERROR",
  SELECTED_PROFILE_LOAD_SUCCESS = "SELECTED_PROFILE_LOAD_SUCCESS",
  ALL_LAWYERS_LOAD_SUCCESS = "ALL_LAWYERS_LOAD_SUCCESS",
  ALL_LAWYERS_LOAD_ERROR = "ALL_LAWYERS_LOAD_ERROR",
  SEARCH_LOAD_SUCCESS = "SEARCH_LOAD_SUCCESS",
  SEARCH_KEY_SUCCESS = "SEARCH_KEY_SUCCESS",
  SEARCH_LOAD_ERROR = "SEARCH_LOAD_ERROR",
  REMOVE_SEARCH = "REMOVE_SEARCH",
  LOGOUT = "LOGOUT",
}

//interface for action names

interface RemoveSearchAction {
  type: typeof LawyersTypes.REMOVE_SEARCH;
}

interface SearchKeySuccessAction {
  type: typeof LawyersTypes.SEARCH_KEY_SUCCESS;
  payload: any;
}

interface LawyersSuccessAction {
  type: typeof LawyersTypes.LAWYERS_LOAD_SUCCESS;
  payload: any;
}
interface LawyersLoadErrorAction {
  type: typeof LawyersTypes.LAWYERS_LOAD_ERROR;
  error: any;
}

interface PictureSuccessAction {
  type: typeof LawyersTypes.PICTURE_LOAD_SUCCESS;
  payload: any;
}
interface PictureLoadErrorAction {
  type: typeof LawyersTypes.PICTURE_LOAD_ERROR;
  error: any;
}

interface ContractsSuccessAction {
  type: typeof LawyersTypes.CONTRACTS_LOAD_SUCCESS;
  payload: any;
}
interface ContractsLoadErrorAction {
  type: typeof LawyersTypes.CONTRACTS_LOAD_ERROR;
  error: any;
}

interface SelectedLawyersSuccessAction {
  type: typeof LawyersTypes.SELECTED_LAWYER_LOAD_SUCCESS;
  payload: any;
}

interface SelectedProfileSuccessAction {
  type: typeof LawyersTypes.SELECTED_PROFILE_LOAD_SUCCESS;
  payload: any;
}

interface SelectedLawyersLoadErrorAction {
  type: typeof LawyersTypes.SELECTED_LAWYER_LOAD_ERROR;
  error: any;
}

interface AllLawyersSuccessAction {
  type: typeof LawyersTypes.ALL_LAWYERS_LOAD_SUCCESS;
  payload: any;
}
interface AllLawyersLoadErrorAction {
  type: typeof LawyersTypes.ALL_LAWYERS_LOAD_ERROR;
  error: any;
}

interface SearchSuccessAction {
  type: typeof LawyersTypes.SEARCH_LOAD_SUCCESS;
  payload: any;
}
interface SearchLoadErrorAction {
  type: typeof LawyersTypes.SEARCH_LOAD_ERROR;
  error: any;
}
interface LogoutAction {
  type: typeof LawyersTypes.LOGOUT;
}

export type LawyersActionTypes =
  | SearchKeySuccessAction
  | LawyersSuccessAction
  | LawyersLoadErrorAction
  | SearchLoadErrorAction
  | SearchSuccessAction
  | AllLawyersLoadErrorAction
  | AllLawyersSuccessAction
  | SelectedLawyersLoadErrorAction
  | SelectedLawyersSuccessAction
  | ContractsLoadErrorAction
  | ContractsSuccessAction
  | PictureLoadErrorAction
  | PictureSuccessAction
  | RemoveSearchAction
  | SelectedProfileSuccessAction
  | LogoutAction;
