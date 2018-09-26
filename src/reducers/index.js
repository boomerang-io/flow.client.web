import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import taskReducer from "../features/BodyWidget/reducer";
import nodeReducer from "../features/BodyWidget/BodyWidgetContainer/reducer/index";

const rootReducer = combineReducers({
  routing: routerReducer,
  tasks: taskReducer,
  nodes: nodeReducer
});

export default rootReducer;
