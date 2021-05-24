export interface ISingleConversation {
  _id: string;
  client: string;
  lawyer: string;
  body: string;
  sender:string;
}
export interface IClient {
  first_name: string;
  last_name: string;
  email: string;
  _id: string;
}
export interface IConversations {
  _id: string;
  lastMessage: string;
  client: IClient;
}
export interface ConversationState {
  single_conversation: ISingleConversation[] | null;
  conversations: IConversations[] | null;
  loading_conv: boolean;
  loading: boolean | null;
  error: any;
  selectedUser?: any | null;
}

//auth action names
export enum ConversationTypes {
  SINGLE_CONVERSATION_LOAD_SUCCESS = "SINGLE_CONVERSATION_LOAD_SUCCESS",
  GET_COVERSTAITONS = "GET_COVERSTAITONS",
  GET_COVERSTAITONS_ERROR = "GET_COVERSTAITONS_ERROR",
  SET_USER = "SET_USER",
  SINGLE_CONVERSATION_LOAD_ERROR = "SINGLE_CONVERSATION_LOAD_ERROR",
  LOGOUT = "LOGOUT",
}

//interface for action names

interface ConversationLoadSuccessAction {
  type: typeof ConversationTypes.SINGLE_CONVERSATION_LOAD_SUCCESS;
  payload: any[];
}
interface GetConversationsAction {
  type: typeof ConversationTypes.GET_COVERSTAITONS;
  payload: any;
}
interface SetUserAction {
  type: typeof ConversationTypes.SET_USER;
  payload: any;
}
interface ConversationLoadErrorAction {
  type: typeof ConversationTypes.SINGLE_CONVERSATION_LOAD_ERROR;
  error: any;
}

interface LogoutAction {
  type: typeof ConversationTypes.LOGOUT;
}

export type ConversationActionTypes =
  | ConversationLoadSuccessAction
  | ConversationLoadErrorAction
  | GetConversationsAction
  | LogoutAction
  | SetUserAction;
