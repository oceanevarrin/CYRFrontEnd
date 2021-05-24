export interface IMessage {
  to: string;
  body: string;
}

export interface MessageState {
  message: IMessage | null;
  loading: boolean | null;
  error: any;
  contactUs: any;
  contactUsLoading: boolean | null;
  contactUsError: any;
}

//auth action names
export enum MessageTypes {
  SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS",
  SEND_MESSAGE_ERROR = "SEND_MESSAGE_ERROR",
  CONTACT_US = "CONTACT_US",
  CONTACT_US_ERROR = "CONTACT_US_ERROR",
  LOGOUT = "LOGOUT",
}

//interface for action names

interface MessageSuccessAction {
  type: typeof MessageTypes.SEND_MESSAGE_SUCCESS;
  payload: any;
}
interface MessageErrorAction {
  type: typeof MessageTypes.SEND_MESSAGE_ERROR;
  error: any;
}
interface ContactUsAction {
  type: typeof MessageTypes.CONTACT_US;
  payload: any;
}
interface ContactUsErrorAction {
  type: typeof MessageTypes.CONTACT_US_ERROR;
  error: any;
}

interface LogoutAction {
  type: typeof MessageTypes.LOGOUT;
}

export type MessageActionTypes =
  | MessageErrorAction
  | MessageSuccessAction
  | ContactUsAction
  | ContactUsErrorAction
  | LogoutAction;
