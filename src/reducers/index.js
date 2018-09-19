import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import taskReducer from "../features/BodyWidget/reducer";

const rootReducer = combineReducers({
  routing: routerReducer,
  tasks: taskReducer
});

export default rootReducer;
