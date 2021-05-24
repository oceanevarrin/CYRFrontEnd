import { Reducer } from "redux";
import { LawyersActionTypes, LawyersState, LawyersTypes } from "./types";

export const lawyersInitialState: LawyersState = {
  lawyers: null,
  allLawyers: null,
  sarchResults: null,
  selectedLawyer: null,
  selectedProfile: null,
  contracts: null,
  profilePicture: null,
  loading: true,
  searchKey: null,
  error: null,
};

export const LawyersReducer: Reducer<LawyersState, LawyersActionTypes> = (
  state = lawyersInitialState,
  action
) => {
  switch (action.type) {
    case LawyersTypes.SEARCH_KEY_SUCCESS:
      return {
        ...state,
        searchKey: action.payload,
        loading: false,
      };
    case LawyersTypes.LAWYERS_LOAD_SUCCESS:
      return {
        ...state,
        lawyers: action.payload,
        loading: false,
      };
    case LawyersTypes.LAWYERS_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
      case LawyersTypes.PICTURE_LOAD_SUCCESS:
        return {
          ...state,
          profilePicture: action.payload,
          loading: false,
        };
      case LawyersTypes.PICTURE_LOAD_ERROR:
        return {
          ...state,
          error: action.error,
          loading: false,
        };
    case LawyersTypes.CONTRACTS_LOAD_SUCCESS:
      return {
        ...state,
        contracts: action.payload,
        loading: false,
      };
    case LawyersTypes.CONTRACTS_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case LawyersTypes.SELECTED_LAWYER_LOAD_SUCCESS:
      return {
        ...state,
        selectedLawyer: action.payload,
        loading: false,
      };
      case LawyersTypes.SELECTED_PROFILE_LOAD_SUCCESS:
        return {
          ...state,
          selectedProfile: action.payload,
          loading: false,
        };
    case LawyersTypes.SELECTED_LAWYER_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case LawyersTypes.ALL_LAWYERS_LOAD_SUCCESS:
      return {
        ...state,
        allLawyers: action.payload,
        loading: false,
      };
    case LawyersTypes.ALL_LAWYERS_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case LawyersTypes.SEARCH_LOAD_SUCCESS:
      return {
        ...state,
        sarchResults: action.payload,
        loading: false,
      };
    case LawyersTypes.SEARCH_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case LawyersTypes.LOGOUT:
      return {
        ...state,
        lawyers: null,
        sarchResults: [],
        allLawyers: null,
        contracts: null,
        selectedLawyer: null,
        selectedProfile: null,
        profilePicture: null,
        loading: null,
        error: null,
      };
    case LawyersTypes.REMOVE_SEARCH:
      return {
        ...state,
        sarchResults: null,
      };
    default:
      return state;
  }
};
