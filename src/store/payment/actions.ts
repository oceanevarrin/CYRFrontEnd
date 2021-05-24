import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import { IErrorData } from "../alert/types";
import { PaymentTypes } from "./types";

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

export const thunkSetupPayments = (
  cardNumber: number,
  expiration_month: number,
  expiration_year: number,
  cvc: number,
  isLawyer: boolean
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let body = {
      cardNumber: cardNumber,
      exp_month: expiration_month,
      exp_year: expiration_year,
      cvc: cvc,
    };

    const user = isLawyer ? "lawyer" : "client";
    const createApi = `/api/${user}/create-customer`;
    const tokenApi = `/api/${user}/create-token`;
    const addCardApi = `/api/${user}/add-card`;

    await ax.get(createApi);
    let res = await ax.post(tokenApi, body);
    dispatch({
      type: PaymentTypes.PAYMENT_CREATED_SUCCESS,
    });
    console.log("back data",res.data);
    
    if(res.data === "success"){
      status = true;
      await ax.get(addCardApi);
    }

  } catch (error) {
    dispatch({
      type: PaymentTypes.PAYMENT_CREATED_ERROR,
      error: errorMessage(error),
    });
  }

  return Promise.resolve(status);
};

export const thunkSetupPayment = (
  cardName: string,
  cardNumber: number,
  expiration_month: number,
  expiration_year: number,
  cvc: number,
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch): Promise<{}> => {
  let stripeResponse = {
      status: false,
      data: {},
  };
  try {
      const ax = await AxAsync();
      let body = {
          name: cardName,
          cc: cardNumber,
          month: expiration_month,
          year: expiration_year,
          cvc: cvc,
      };

      const createApi = '/api/client/subscribe_company';
      const subscribeApi = '/api/client/process_payment';

      let res = await ax.get(createApi);

      if (res.data['success']) {
          await ax
              .post(subscribeApi, body)
              .then((response) => {
                  stripeResponse.data = response.data;
                  if (response.data['success']) {
                      stripeResponse.status = true;
                      dispatch({
                          type: PaymentTypes.PAYMENT_CREATED_SUCCESS,
                      });
                  }
              })
              .catch((error) => {
                  stripeResponse.data = error.response.data;
              });
      } else {
          stripeResponse.data = res;
      }
  } catch (error) {
      dispatch({
          type: PaymentTypes.PAYMENT_CREATED_ERROR,
          error: errorMessage(error),
      });
  }

  return Promise.resolve(stripeResponse);
};

export const thunkActivateSetupPayment = (
  email:string,
  cardName: string,
  cardNumber: number,
  expiration_month: number,
  expiration_year: number,
  cvc: number,
  subtype: string,
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch): Promise<{}> => {
  let stripeResponse = {
      status: false,
      data: {},
  };
  try {
      const ax = await AxAsync();
      let body = {
          email:email,
          name: cardName,
          cc: cardNumber,
          month: expiration_month,
          year: expiration_year,
          cvc: cvc,
      };

      const createApi = '/api/client/subscribe_company';
      const subscribeApi = '/api/client/activate_process_payment';

      let res = await ax.post(createApi,{email:email});

      if (res.data['success']) {
          await ax
              .post(subscribeApi, body)
              .then((response) => {
                  stripeResponse.data = response.data;
                  if (response.data['success']) {
                      stripeResponse.status = true;
                      dispatch({
                          type: PaymentTypes.PAYMENT_CREATED_SUCCESS,
                      });
                  }
              })
              .catch((error) => {
                  stripeResponse.data = error.response.data;
              });
      } else {
          stripeResponse.data = res;
      }
  } catch (error) {
      dispatch({
          type: PaymentTypes.PAYMENT_CREATED_ERROR,
          error: errorMessage(error),
      });
  }

  return Promise.resolve(stripeResponse);
};

export const thunkCancelSubscription = (): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
): Promise<{}> => {
  let stripeResponse = {
      status: false,
      data: {},
  };
  try {
      const ax = await AxAsync();

      const cancelApi = '/api/client/cancel_subscription';

      await ax
          .get(cancelApi)
          .then((response) => {
              stripeResponse.data = response.data;
              if (response.data['success']) {
                  stripeResponse.status = true;
                  dispatch({
                      type: PaymentTypes.SUBSCRIPTION_CANCEL_SUCCESS,
                  });
              }
          })
          .catch((error) => {
              stripeResponse.data = error.response.data;
          });
  } catch (error) {
      dispatch({
          type: PaymentTypes.SUBSCRIPTION_CANCEL_ERROR,
          error: errorMessage(error),
      });
  }

  return Promise.resolve(stripeResponse);
};

export const thunkGetSubscriptionDetail = (): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  try {
      const ax = await AxAsync();
      let res = await ax.get('/api/client/my_subscription');

      // let res = await Axios.get('/api/companies/get-courses');
      const detail = res.data;
      dispatch({
          type: PaymentTypes.SUBSCRIPTION_DETAIL_SUCCESS,
          payload: detail,
      });
  } catch (error) {
      const msg = errorMessage(error);
      dispatch({
          type: PaymentTypes.SUBSCRIPTION_DETAIL_FAIL,
          error: msg,
      });
  }
};

export const logout = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  dispatch({ type: PaymentTypes.LOGOUT });
};
