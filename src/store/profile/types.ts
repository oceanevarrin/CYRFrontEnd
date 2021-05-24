import { IOption } from "../../pages/lawyer/EditProfile";

export interface IProfile {
  location: string,
  legal_fields: string[],
  languages: string[],
  services: string[],
  description: string,
  short_description: string,
  career_path: string,
  tariff: number,
}

export interface ProfileState {
  profile: IProfile | null;
  selectedLocation: IOption | null;
  selectedLegalFields: IOption[] | null;
  selectedServices: IOption[] | null;
  selectedLanguages: IOption[] | null;
  loading: boolean | null;
  error: any;
}

//auth action names
export enum ProfileTypes {
  PROFILE_LOAD_SUCCESS = "PROFILE_LOAD_SUCCESS",
  SET_SELECTED_LOCATION_SUCCESS = "SET_SELECTED_LOCATION_SUCCESS",
  SET_SELECTED_SERVICES_SUCCESS = "SET_SELECTED_SERVICES_SUCCESS",
  SET_SELECTED_LANGUAGES_SUCCESS = "SET_SELECTED_LANGUAGES_SUCCESS",
  SET_SELECTED_LEGAL_FIELDS_SUCCESS = "SET_SELECTED_LEGAL_FIELDS_SUCCESS",
  PROFILE_LOAD_ERROR = "PROFILE_LOAD_ERROR",
  LOGOUT = "LOGOUT",
}

//interface for action names

interface ProfileSuccessAction {
  type: typeof ProfileTypes.PROFILE_LOAD_SUCCESS;
  payload: any;
}

interface SetLanguageSuccessAction {
  type: typeof ProfileTypes.SET_SELECTED_LANGUAGES_SUCCESS;
  payload: any;
}
interface SetLegalFieldsSuccessAction {
  type: typeof ProfileTypes.SET_SELECTED_LEGAL_FIELDS_SUCCESS;
  payload: any;
}
interface SetServicesSuccessAction {
  type: typeof ProfileTypes.SET_SELECTED_SERVICES_SUCCESS;
  payload: any;
}
interface SetLocationSuccessAction {
  type: typeof ProfileTypes.SET_SELECTED_LOCATION_SUCCESS;
  payload: any;
}
interface ProfileLoadErrorAction {
  type: typeof ProfileTypes.PROFILE_LOAD_ERROR;
  error: any;
}

interface LogoutAction {
  type: typeof ProfileTypes.LOGOUT;
}

export type ProfileActionTypes =
  | ProfileSuccessAction
  | ProfileLoadErrorAction
  | SetLocationSuccessAction
  | SetServicesSuccessAction
  | SetLegalFieldsSuccessAction
  | SetLanguageSuccessAction
  | LogoutAction
