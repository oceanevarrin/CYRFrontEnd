//payment action names
export interface SubscriptionDetail {
  subscription_type: string;
  is_subscribed: boolean;
  subscription_date: Date;
  cc_attached: string;
  success: boolean;
}

export interface PaymentState {
  loading: boolean | null;
  subscriptionDetail: SubscriptionDetail | null;
  error: any;
}

export interface IErrorMessage {
  success: boolean;
  message: string;
}

export enum PaymentTypes {
  PAYMENT_CREATED_SUCCESS = "PAYMENT_CREATED_SUCCESS",
  PAYMENT_CREATED_ERROR = "PAYMENT_CREATED_ERROR",
  SUBSCRIPTION_DETAIL_SUCCESS = "SUBSCRIPTION_DETAIL_SUCCESS",
  SUBSCRIPTION_DETAIL_FAIL = "SUBSCRIPTION_DETAIL_FAIL",
  SUBSCRIPTION_CANCEL_SUCCESS = "SUBSCRIPTION_CANCEL_SUCCESS",
  SUBSCRIPTION_CANCEL_ERROR = "SUBSCRIPTION_CANCEL_ERROR",
  LOGOUT = "LOGOUT",
}

//interface for action names

interface SubscriptionCancelSuccessAction {
  type: typeof PaymentTypes.SUBSCRIPTION_CANCEL_SUCCESS;
}

interface SubscriptionCancelErrorAction {
  type: typeof PaymentTypes.SUBSCRIPTION_CANCEL_ERROR;
  error: any;
}

interface SubscribtionDetailSuccessAction {
  type: typeof PaymentTypes.SUBSCRIPTION_DETAIL_SUCCESS;
  payload: any;
}

interface SubscribtionDetailFailedAction {
  type: typeof PaymentTypes.SUBSCRIPTION_DETAIL_FAIL;
  error?: any;
}

interface PaymentCreationSuccessAction {
  type: typeof PaymentTypes.PAYMENT_CREATED_SUCCESS;
}

interface PaymentCreationErrorAction {
  type: typeof PaymentTypes.PAYMENT_CREATED_ERROR;
  error: any;
}

interface LogoutAction {
  type: typeof PaymentTypes.LOGOUT;
}

export type PaymentActionTypes =
  | SubscriptionCancelErrorAction
  | SubscriptionCancelSuccessAction
  | SubscribtionDetailFailedAction
  | SubscribtionDetailSuccessAction
  | PaymentCreationSuccessAction
  | PaymentCreationErrorAction
  | LogoutAction;
