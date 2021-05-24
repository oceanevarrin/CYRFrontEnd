import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import { IErrorData } from "../alert/types";
import {
  thunkGetConversations,
  thunkGetSingleConversation,
} from "../conversations/actions";
import { MessageTypes } from "./types";

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

export const thunkSendMessage = (
  recipientId: string,
  newMessage: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  useState
): Promise<boolean> => {
  let status = false;
  const state = useState();
  try {
    const ax = await AxAsync();
    let res;

    let body = { to: recipientId, body: newMessage };
    const api = state.auth.isLawyer
      ? "/api/lawyer/post-message"
      : "/api/client/post-message";
    res = await ax.post(api, body);
    dispatch({
      type: MessageTypes.SEND_MESSAGE_SUCCESS,
      payload: res.data,
    });
    dispatch(thunkGetSingleConversation(recipientId));
    dispatch(thunkGetConversations());
    status = true;
  } catch (error) {
    dispatch({
      type: MessageTypes.SEND_MESSAGE_ERROR,
      error: errorMessage(error),
    });
  }
  return Promise.resolve(status);
};

export const thunkContactUs = (body: {
  email: string;
  message: string;
}): ThunkAction<void, AppState, null, Action<string>> => async (dispatch): Promise<boolean> => {
  let status = false;
  try {
    const ax = await AxAsync();
    let res =await ax.post("/api/lawyer/contact-us", body)
    dispatch({
      type: MessageTypes.CONTACT_US,
      payload: res.data,
    });
    if(res.data === 'success'){
      status = true;
    }
  }catch (error) {
    dispatch({
      type: MessageTypes.CONTACT_US_ERROR,
      error: errorMessage(error),
    });
  }
  return Promise.resolve(status);
};
