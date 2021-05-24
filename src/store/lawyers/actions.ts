import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync, baseURL } from "../../config";
import { IErrorData } from "../alert/types";
import { ILawyer, LawyersTypes } from "./types";
import axios from "axios";
import { IProfile } from "../profile/types";

export const FileAsync = async () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL,
    headers: {
      'Content-type': "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      Authorization: token,
    },
  });
};
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

export const thunkGetLawyers = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/client/lawyers";
    res = await ax.get(api);
    dispatch({
      type: LawyersTypes.LAWYERS_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LawyersTypes.LAWYERS_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkRequestApproval = (file:FormData): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async () : Promise<boolean> => {
  let status = false;
  try {
    const ax = await FileAsync();
    const api = "/api/lawyer/request-activation";
    let body ={file:file}
    await ax.post(api,body);
    status = true;
  } catch (error) {
    
  }
  return Promise.resolve(status);
};

export const thunkRateLawyer = (
  id: string,
  value: number
): ThunkAction<void, AppState, null, Action<string>> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = { id: id, rating: value };
    
    const api = "/api/client/rate-lawyer";
    await ax.post(api, body);
    status = true;
  } catch (error) {
    console.log(errorMessage(error));
  }

  return Promise.resolve(status);
};

export const thunkGetAllLawyers = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/lawyer/all-lawyers";
    res = await ax.get(api);
    dispatch({
      type: LawyersTypes.ALL_LAWYERS_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LawyersTypes.ALL_LAWYERS_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkGetAllRegisteredLawyers = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/lawyer/all-registered-lawyers";
    res = await ax.get(api);
    dispatch({
      type: LawyersTypes.ALL_LAWYERS_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LawyersTypes.ALL_LAWYERS_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkGetContracts = (isLawyer: boolean): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;
    let user = isLawyer ? 'lawyer' : 'client';
    const api = `/api/${user}/contracts`;
    res = await ax.get(api);
    dispatch({
      type: LawyersTypes.CONTRACTS_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LawyersTypes.CONTRACTS_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkGetProfilePicture = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/lawyer/picture";
    res = await ax.get(api);
    dispatch({
      type: LawyersTypes.PICTURE_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LawyersTypes.PICTURE_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkDecideOnContracts = (id:string, accepted:boolean): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = { contract_id: id, }
    const decision = accepted ? 'accept' : 'reject';
    const api = `/api/lawyer/${decision}-contract`;
    await ax.post(api, body);
    status = true;
  } catch (error) {
  }
  return Promise.resolve(status);
};

export const thunkApproveLawyer = (id:string): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = { lawyer_id: id}
    const api = "/api/lawyer/activate-lawyer";
    await ax.post(api, body);
    status = true;
  } catch (error) {
  }
  return Promise.resolve(status);
};

export const thunkGetSearchResults = (
  lawyerServices: string,
  lawyerLanguages: string,
  location: string,
  legalfields: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let res;
    let body = {
      location: location,
      language: lawyerLanguages,
      legal_field: legalfields,
      service: lawyerServices,
    };
    const api = "/api/client/get-search-results";
    res = await ax.post(api, body);
    dispatch({
      type: LawyersTypes.SEARCH_LOAD_SUCCESS,
      payload: res.data,
    });
    status = true;
  } catch (error) {
    dispatch({
      type: LawyersTypes.SEARCH_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
  return Promise.resolve(status);
};

export const removeSearch = () => {
  return {
    type: LawyersTypes.REMOVE_SEARCH,
  };
};

export const thunkSetSelectedUser = (lawyer: ILawyer) => {
  return {
    type: LawyersTypes.SELECTED_LAWYER_LOAD_SUCCESS,
    payload: lawyer,
  };
};

export const thunkSetSelectedProfile = (profile: IProfile) => {
  return {
    type: LawyersTypes.SELECTED_PROFILE_LOAD_SUCCESS,
    payload: profile,
  };
};

export const logout = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  dispatch({ type: LawyersTypes.LOGOUT });
};
