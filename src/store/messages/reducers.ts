import { Reducer } from "redux";
import { MessageActionTypes, MessageState, MessageTypes } from "./types";

export const messageInitialState: MessageState = {
  message: null,
  loading: null,
  error: null,
  contactUs: null,
  contactUsError: null,
  contactUsLoading: null,
};

export const MessageReducer: Reducer<MessageState, MessageActionTypes> = (
  state = messageInitialState,
  action
) => {
  switch (action.type) {
    case MessageTypes.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    case MessageTypes.SEND_MESSAGE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case MessageTypes.CONTACT_US:
      return {
        ...state,
        contactUs: action.payload,
        contactUsLoading: false,
      };
    case MessageTypes.CONTACT_US_ERROR:
      return {
        ...state,
        contactUsError: action.error,
        contactUsLoading: false,
      };
    case MessageTypes.LOGOUT:
      return {
        ...state,
        message: null,
        loading: null,
        error: null,
      };
    default:
      return state;
  }
};
