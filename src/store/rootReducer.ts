import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AlertReducer } from "./alert/reducers";
import { AlertState } from "./alert/types";
import { AuthReducer } from "./authenticate/reducers";
import { AuthState } from "./authenticate/types";
import { ClientsReducer } from "./clients/reducers";
import { ClientsState } from "./clients/types";
import { ConversationReducer } from "./conversations/reducers";
import { ConversationState } from "./conversations/types";
import { LawyersReducer } from "./lawyers/reducers";
import { LawyersState } from "./lawyers/types";
import { MessageReducer } from "./messages/reducers";
import { MessageState } from "./messages/types";
import { PaymentReducer } from "./payment/reducers";
import { PaymentState } from "./payment/types";
import { ProfileReducer } from "./profile/reducers";
import { ProfileState } from "./profile/types";
import { UsersReducer } from "./users/reducer";
import { UsersState } from "./users/types";

export const rootReducer: Reducer<
  CombinedState<{
    auth: AuthState;
    users: UsersState;
    lawyers: LawyersState;
    clients: ClientsState;
    profile: ProfileState;
    message: MessageState;
    conversations: ConversationState;
    payment: PaymentState;
    alerts: AlertState;
  }>,
  AnyAction
> = combineReducers({
  auth: AuthReducer,
  users: UsersReducer,
  lawyers: LawyersReducer,
  clients: ClientsReducer,
  profile: ProfileReducer,
  message: MessageReducer,
  conversations: ConversationReducer,
  payment: PaymentReducer,
  alerts: AlertReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: [
    "users",
    "lawyers",
    "conversations",
    "alerts",
    "message",
    "clients",
  ],
};

export default persistReducer(persistConfig, rootReducer);
