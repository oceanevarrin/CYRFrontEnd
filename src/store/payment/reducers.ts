import { Reducer } from "redux";
import { PaymentActionTypes, PaymentState, PaymentTypes } from "./types";

export const paymentInitialState: PaymentState = {
  loading: null,
  subscriptionDetail: null,
  error: null,
};

export const PaymentReducer: Reducer<PaymentState, PaymentActionTypes> = (
  state = paymentInitialState,
  action
) => {
  switch (action.type) {
    case PaymentTypes.PAYMENT_CREATED_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case PaymentTypes.PAYMENT_CREATED_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case PaymentTypes.SUBSCRIPTION_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptionDetail: action.payload,
      };
    case PaymentTypes.SUBSCRIPTION_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case PaymentTypes.LOGOUT:
      return {
        ...state,
        loading: null,
        subscriptionDetail: null,
        error: null,
      };
    default:
      return state;
  }
};
