import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { AxAsync } from "../../config";
import { IErrorData } from "../alert/types";
import { ConversationTypes } from "./types";

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

export const thunkGetSingleConversation = (
  recipientId: string
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  useState
) => {
  const state = useState();
  try {
    let body = { to: recipientId };
    const api = state.auth.isLawyer
      ? "/api/lawyer/single-conversation"
      : "/api/client/single-conversation";
      const ax = await AxAsync();
    const res = await ax.post(api, body);
    dispatch({
      type: ConversationTypes.SINGLE_CONVERSATION_LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ConversationTypes.SINGLE_CONVERSATION_LOAD_ERROR,
      error: errorMessage(error),
    });
  }
};
export const thunkGetConversations = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async (dispatch, useState) => {
  const state = useState();
  try {
    const ax = await AxAsync();
    const api = state.auth.isLawyer
      ? "/api/lawyer/conversations"
      : "/api/client/conversations";
    const res = await ax.get(api);
    dispatch({
      type: ConversationTypes.GET_COVERSTAITONS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ConversationTypes.GET_COVERSTAITONS_ERROR,
      error: errorMessage(error),
    });
  }
};
