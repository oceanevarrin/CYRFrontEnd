import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import { IErrorData } from "../alert/types";
import { ClientsTypes } from "./types";

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

export const thunkGetClients = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/client/all-clients";
    res = await ax.get(api);
    dispatch({
      type: ClientsTypes.CLIENTS_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ClientsTypes.CLIENTS_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};

export const thunkSignContract = (contract_title: string, lawyer: string, price: number): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) : Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let res;

    const api = "/api/client/prepare-contract";
    let body = {contract_title:contract_title, lawyer: lawyer, payment_amount: price }
    res = await ax.post(api, body);
    dispatch({
      type: ClientsTypes.CONTRACT_SIGN_SUCCESS,
      payload: res.data,
    });
    status = true;
  } catch (error) {
    dispatch({
      type: ClientsTypes.CONTRACT_SIGN_ERROR,
      error: errorMessage(error),
    });
  }
  return Promise.resolve(status);
};

export const thunkMakePayment = (id:string, description:string): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = { contract_id: id, description: description }
    // const workApi = "/api/client/complete-work"
    const api = "/api/client/pay";
    // await ax.post(workApi, { contract_id: id});
    await ax.post(api, body);
    status = true;
  } catch (error) {
  }
  return Promise.resolve(status);
};

export const thunkCompleteWork = (id:string): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = { contract_id: id };
    const api = "/api/client/complete-work";
    await ax.post(api, body);
    status = true;
  } catch (error) {
  }
  return Promise.resolve(status);
};

export const logout = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  dispatch({ type: ClientsTypes.LOGOUT });
};
