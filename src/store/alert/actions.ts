import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { v4 } from "uuid";
import { AppState } from "..";
import { AlertTypes, IAlert } from "./types";

export const thunkSetAlert = (
  alert: IAlert
): ThunkAction<void, AppState, unknown, Action<string>> => (dispatch) => {
  const uuid = v4();
  const { timeout = 3000, id = uuid, ...rest } = alert;

  dispatch({
    type: AlertTypes.SET_ALERT,
    payload: { id, ...rest },
  });
  setTimeout(
    () => dispatch({ type: AlertTypes.REMOVE_ALERT, payload: id }),
    timeout
  );
};
