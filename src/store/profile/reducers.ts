import { Reducer } from "redux";
import { ProfileActionTypes, ProfileState, ProfileTypes } from "./types";

export const profileInitialState: ProfileState = {
  profile: null,
  selectedLocation: null,
  selectedLegalFields: null,
  selectedServices: null,
  selectedLanguages: null,
  loading: null,
  error: null,
};

export const ProfileReducer: Reducer<ProfileState, ProfileActionTypes> = (
  state = profileInitialState,
  action
) => {
  switch (action.type) {
    case ProfileTypes.PROFILE_LOAD_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case ProfileTypes.SET_SELECTED_LOCATION_SUCCESS:
      return {
        ...state,
        selectedLocation: action.payload,
        loading: false,
      };
    case ProfileTypes.SET_SELECTED_SERVICES_SUCCESS:
      return {
        ...state,
        selectedServices: action.payload,
        loading: false,
      };
    case ProfileTypes.SET_SELECTED_LANGUAGES_SUCCESS:
      return {
        ...state,
        selectedLanguages: action.payload,
        loading: false,
      };
    case ProfileTypes.SET_SELECTED_LEGAL_FIELDS_SUCCESS:
      return {
        ...state,
        selectedLegalFields: action.payload,
        loading: false,
      };
    case ProfileTypes.PROFILE_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ProfileTypes.LOGOUT:
      return {
        ...state,
        profile: null,
        selectedLocation: null,
        selectedLegalFields: null,
        selectedServices: null,
        selectedLanguages: null,
        loading: null,
        error: null,
      };
    default:
      return state;
  }
};
