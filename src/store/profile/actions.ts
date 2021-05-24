import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import { IOption } from "../../pages/lawyer/EditProfile";
import { IErrorData } from "../alert/types";
import { ProfileTypes } from "./types";

export const errorMessage = (error: any): IErrorData => {
  if (error.response?.data) {
    return error.response.data;
  }
  return {
    title: "SERVER NOT FOUND",
    detail: "CONNECTION REFUSED",
    status: 404,
  };
};

export const thunkGetProfile = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/lawyer/get-profile";
    res = await ax.get(api);
    dispatch({
      type: ProfileTypes.PROFILE_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ProfileTypes.PROFILE_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkGetLawyerProfile = (lawyer_id:string): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/client/lawyer-profile";
    res = await ax.post(api,{lawyer_id});
    dispatch({
      type: ProfileTypes.PROFILE_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ProfileTypes.PROFILE_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkCreateProfile = (
  location: string,
  legalfields: string[],
  serv: string[],
  lang: string[],
  tariff: number,
  description: string,
  short_description: string,
  career_path: string
): ThunkAction<void, AppState, null, Action<string>> => async (): Promise<
  boolean
> => {
  let status = false;
  try {
    let body = {
      location: location,
      legal_fields: legalfields,
      languages: lang,
      description: description,
      tariff: tariff,
      services: serv,
      short_description: short_description,
      career_path: career_path
    };
    const ax = await AxAsync();
    await ax.post("/api/lawyer/build-profile", body);
    status = true;
  } catch (error) {
    console.log(error);
  }

  return Promise.resolve(status);
};

export const thunkUpdateProfile = (
  location: string,
  legalfields: string[],
  serv: string[],
  lang: string[],
  tariff: number,
  description: string,
  short_description: string,
  career_path: string
): ThunkAction<void, AppState, null, Action<string>> => async (): Promise<
  boolean
> => {
  let status = false;
  try {
    let body = {
      location: location,
      legal_fields: legalfields,
      languages: lang,
      description: description,
      tariff: tariff,
      services: serv,
      short_description: short_description,
      career_path: career_path
    };
    const ax = await AxAsync();
    await ax.post("/api/lawyer/edit-profile", body);
    status = true;
  } catch (error) {
    console.log(error);
  }

  return Promise.resolve(status);
};

export const thunkSetSelectedLanguage = (languages: IOption[]) => {
  return {
    type: ProfileTypes.SET_SELECTED_LANGUAGES_SUCCESS,
    payload: languages,
  };
};

export const thunkSetSelectedLegalFields = (legalfields: IOption[]) => {
  return {
    type: ProfileTypes.SET_SELECTED_LEGAL_FIELDS_SUCCESS,
    payload: legalfields,
  };
};

export const thunkSetSelectedServices = (services: IOption[]) => {
  return {
    type: ProfileTypes.SET_SELECTED_SERVICES_SUCCESS,
    payload: services,
  };
};

export const thunkSetSelectedLocation = (location: IOption) => {
  return {
    type: ProfileTypes.SET_SELECTED_LOCATION_SUCCESS,
    payload: location,
  };
};

export const logout = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  dispatch({ type: ProfileTypes.LOGOUT });
};
