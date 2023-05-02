import { combineReducers } from "redux";
import loggedInReducer from "./loggedInReducer";

const reducers = combineReducers({
  loggedIn: loggedInReducer,
});

export default reducers;
