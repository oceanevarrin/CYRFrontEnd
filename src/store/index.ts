import {
  applyMiddleware,
  createStore,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import setAuthToken from "../utils/setAuthToken";
import { authInitialState } from "./authenticate/reducers";

import { persistReducer } from 'redux-persist' // imports from redux-persist
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { rootReducer } from "./rootReducer";

const initialState = {};
const persistConfig = {
    key: 'root',
    storage: storage,
};


const persistedReducer: any = persistReducer(persistConfig, rootReducer);
export type AppState = ReturnType<typeof rootReducer>;

const middlewares = [thunkMiddleware];
const middleWareEnhancer = applyMiddleware(...middlewares);

const store = createStore(persistedReducer, initialState, composeWithDevTools(middleWareEnhancer));


let currentState = {
  auth: authInitialState
};
store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState() as any;
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState?.auth?.token;
    setAuthToken(token!);
  }
});

export default store;
