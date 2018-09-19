import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import taskReducer from "../features/demo-drag-and-drop/reducer";
import blogPostsReducer from "../features/BlogPosts/reducer";

const rootReducer = combineReducers({
  routing: routerReducer,
  tasks: taskReducer,
  blogPosts: blogPostsReducer
});

export default rootReducer;
