import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import setAuthToken, { setLawyer } from "../../utils/setAuthToken";
import { thunkSetAlert } from "../alert/actions";
import { IErrorData } from "../alert/types";
import { ClientsTypes } from "../clients/types";
import { ConversationTypes } from "../conversations/types";
import { LawyersTypes } from "../lawyers/types";
import { ProfileTypes } from "../profile/types";
import { AuthActionTypes, AuthTypes } from "./types";

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

export const thunkForgotPassword = (
  email: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<{}> => {
  let Response = {
    status: false,
    data: {},
  };
  const body = { userEmail: email };
  const ax = await AxAsync();

  await ax
    .post("/api/lawyer/forgot-password", body)
    .then((response) => {
      Response.data = response.data;
      if (response.data["success"]) {
        Response.status = true;
        dispatch({
          type: AuthTypes.RESET_PASSWORD_SUCCESS,
          payload: { response },
        });
      }
    })
    .catch((error) => {
      Response.data = error.response.data;
    });
  return Promise.resolve(Response);
};
export const thunkClientForgotPassword = (
  email: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<{}> => {
  let Response = {
    status: false,
    data: {},
  };
  const body = { userEmail: email };
  const ax = await AxAsync();

  await ax
    .post("/api/client/forgot-password", body)
    .then((response) => {
      Response.data = response.data;
      if (response.data["success"]) {
        Response.status = true;
        dispatch({
          type: AuthTypes.RESET_PASSWORD_SUCCESS,
          payload: { response },
        });
      }
    })
    .catch((error) => {
      Response.data = error.response.data;
    });
  return Promise.resolve(Response);
};

export const thunkResetPassword = (
  token: string,
  password: string
): ThunkAction<void, AppState, null, Action<string>> => async () => {
  const body = { token, password };
  try {
    const ax = await AxAsync();
    await ax.post("/api/lawyer/reset-password", body);
  } catch (error) {
    console.log(error);
  }
};

export const thunkClientResetPassword = (
  token: string,
  password: string
): ThunkAction<void, AppState, null, Action<string>> => async () => {
  const body = { token, password };
  try {
    const ax = await AxAsync();
    await ax.post("/api/client/reset-password", body);
  } catch (error) {
    console.log(error);
  }
};

export const thunkLoadUser = (
  isLawyer: boolean
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  if (localStorage.getItem("token")) {
    try {
      const ax = await AxAsync();
      let res;
      dispatch({ type: AuthTypes.AUTH_STARTED });
      const api = isLawyer ? "/api/lawyer/current" : "/api/client/current";
      res = await ax.get(api);
      dispatch({
        type: AuthTypes.USER_LOAD_SUCCESS,
        payload: res.data,
        isLawyer,
      });
    } catch (error) {
      dispatch({
        type: AuthTypes.USER_LOAD_ERROR,
        error: errorMessage(error),
      });
    }
  } else {
  }
};

export const thunkTrialPeriod = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch) => {
  try {
    const ax = await AxAsync();
    let res = await ax.get("/api/client/trial-period");

    // let res = await Axios.get('/api/companies/get-courses');
    const trialPeriod = res.data["days_left"];

    dispatch({
      type: AuthTypes.TRIAL_PERIOD_SUCCESS,
      payload: trialPeriod,
    });
  } catch (error) {
    const msg = errorMessage(error);
    dispatch({
      type: AuthTypes.TRIAL_PERIOD_FAIL,
      error: msg,
    });
  }
};

export const thunkDeleteAccount = (
  isLawyer: boolean,
  id: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<boolean> => {
  let status = false;
  if (localStorage.getItem("token")) {
    try {
      const ax = await AxAsync();
      const body = isLawyer ? { lawyer_id: id } : { client_id: id };

      const api = isLawyer
        ? "/api/lawyer/delete-account"
        : "/api/client/delete-account";
      let res = await ax.post(api, body);
      if (res.data === "success") status = true;
      dispatch({
        type: AuthTypes.USER_LOAD_SUCCESS,
        payload: {},
        isLawyer: null,
      });
      dispatch(logout());
    } catch (error) {
      dispatch({
        type: AuthTypes.USER_LOAD_ERROR,
        error: errorMessage(error),
      });
    }
  } else {
  }
  return Promise.resolve(status);
};

export const thunkDeleteUser = (
  isLawyer: boolean,
  id: string
): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    const body = isLawyer ? { lawyer_id: id } : { client_id: id };

    const api = isLawyer
      ? "/api/lawyer/delete-lawyer"
      : "/api/lawyer/delete-client";
    let res = await ax.post(api, body);
    if (res.data === "success") status = true;
  } catch (error) {}
  return Promise.resolve(status);
};

// export const thunkLogin = (
//   email: string,
//   password: string,
//   isLawyer: boolean
// ): ThunkAction<void, AppState, null, AuthActionTypes> => async (dispatch) => {
//   const body = { email, password };
//   try {
//     const ax = await AxAsync();
//     const api = isLawyer ? "/api/lawyer/login" : "/api/client/login";
//     dispatch({ type: AuthTypes.AUTH_STARTED });

//     const res = await ax.post(api, body);

//     const { token, user } = res.data;

//     setAuthToken(token!);
//     setLawyer(isLawyer!);

//     dispatch({
//       type: AuthTypes.LOGIN_SUCCESS,
//       payload: { user, token, isLawyer },
//     });
//   } catch (error) {
//     const msg = errorMessage(error);
//     if (msg) {
//       dispatch(thunkSetAlert({ name: "login", msg, alertType: "danger" }));
//     }
//     dispatch({
//       type: AuthTypes.LOGIN_FAIL,
//       error: msg,
//     });
//   }
// };

export const thunkLogin = (
  email: string,
  password: string,
  isLawyer: boolean
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch
): Promise<{}> => {
  dispatch({ type: AuthTypes.AUTH_STARTED });
  let response = {
    status: false,
    data: {
      error: "",
    },
  };
  const body = { email, password };
  try {
    const ax = await AxAsync();
    const api = isLawyer ? "/api/lawyer/login" : "/api/client/login";
    const res = await ax.post(api, body);
    const { token, ...user } = res.data;
    response.status = true;
    response.data = res.data;
    setAuthToken(token!);
    setLawyer(isLawyer!);
    dispatch({
      type: AuthTypes.LOGIN_SUCCESS,
      payload: { user, token, isLawyer },
    });
  } catch (error) {
    const msg = errorMessage(error);
    if (msg) {
      dispatch(thunkSetAlert({ name: "login", msg, alertType: "danger" }));
    }
    dispatch({
      type: AuthTypes.LOGIN_FAIL,
      error: msg,
    });
    console.log("error data --- ", msg);

    response.data = error.response.data;
  }

  return Promise.resolve(response);
};

export const thunkRegister = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  isLawyer: boolean
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  const body = {
    first_name: firstname,
    last_name: lastname,
    email: email,
    password: password,
  };

  try {
    const ax = await AxAsync();
    dispatch({ type: AuthTypes.AUTH_STARTED });

    const api = isLawyer ? "/api/lawyer/register" : "/api/client/register";

    const res = await ax.post(api, body);

    dispatch({
      type: AuthTypes.REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(thunkLogin(email, password, isLawyer));
  } catch (error) {
    const msg = errorMessage(error);
    if (msg) {
      dispatch(thunkSetAlert({ name: "register", msg, alertType: "danger" }));
    }
    dispatch({
      type: AuthTypes.REGISTER_FAIL,
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
  dispatch({ type: AuthTypes.LOGOUT });
  dispatch({ type: ConversationTypes.LOGOUT });
  dispatch({ type: ClientsTypes.LOGOUT });
  dispatch({ type: ProfileTypes.LOGOUT });
  dispatch({ type: LawyersTypes.LOGOUT });
};
