import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { instance } from "../../config";
import { UsersTypes } from "./types";

export const thunkForgotPassword = (
  email: string
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch({ type: UsersTypes.START_LOADING, id: UsersTypes.forgotPassword });
  instance()
    .post("/forgot-password")
    .then((res) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        payload: res,
      });
    })
    .catch((err) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        error: err.response,
      });
    });
};
export const thunkChangePassword = (
  oldPassword: string,
  newPassword: string
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch({ type: UsersTypes.START_LOADING, id: UsersTypes.forgotPassword });
  instance()
    .post("/change-password", { oldPassword, newPassword })
    .then((res) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        payload: res,
      });
    })
    .catch((err) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        error: err.response,
      });
    });
};
export const thunkResetPassword = (
  newPassword: string
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  dispatch({ type: UsersTypes.START_LOADING, id: UsersTypes.forgotPassword });
  instance()
    .post("/reset-password", { newPassword })
    .then((res) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        payload: res,
      });
    })
    .catch((err) => {
      dispatch({
        type: UsersTypes.forgotPassword,
        error: err.response,
      });
    });
};
