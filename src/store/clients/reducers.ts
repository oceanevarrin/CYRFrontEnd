import { Reducer } from "redux";
import { ClientsActionTypes, ClientsState, ClientsTypes } from "./types";

export const clientsInitialState: ClientsState = {
  clients: [],
  loading: true,
  error: null,
};

export const ClientsReducer: Reducer<ClientsState, ClientsActionTypes> = (
  state = clientsInitialState,
  action
) => {
  switch (action.type) {
    case ClientsTypes.CLIENTS_LOAD_SUCCESS:
      return {
        ...state,
        clients: action.payload,
        loading: false,
      };
    case ClientsTypes.CLIENTS_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ClientsTypes.LOGOUT:
      return {
        ...state,
        clients: null,
        loading: null,
        error: null,
      };
    default:
      return state;
  }
};
