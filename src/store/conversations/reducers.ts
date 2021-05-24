import { Reducer } from "redux";
import {
  ConversationActionTypes,
  ConversationState,
  ConversationTypes,
} from "./types";

export const conversationInitialState: ConversationState = {
  single_conversation: null,
  conversations: null,
  loading_conv: true,
  loading: null,
  selectedUser: null,
  error: null,
};

export const ConversationReducer: Reducer<
  ConversationState,
  ConversationActionTypes
> = (state = conversationInitialState, action) => {
  switch (action.type) {
    case ConversationTypes.SINGLE_CONVERSATION_LOAD_SUCCESS:
      return {
        ...state,
        single_conversation: action.payload,
        loading: false,
      };
    case ConversationTypes.GET_COVERSTAITONS:
      return {
        ...state,
        conversations: action.payload,
        loading_conv: false,
      };
    case ConversationTypes.SINGLE_CONVERSATION_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ConversationTypes.SET_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case ConversationTypes.LOGOUT:
      return {
        ...state,
        single_conversation: null,
        conversations:null,
        selectedUser:null,
        loading: null,
        error: null,
      };
    default:
      return state;
  }
};
