import { createStore, compose, applyMiddleware } from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "State";
import { APP_ROOT } from "../config/appConfig";
// Configure history object to use APP_ROOT as the prefix for all React Router routes and links
export const history = createHistory({ basename: APP_ROOT });

function configureStoreProd(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
    reactRouterMiddleware
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  return createStore(rootReducer(history), initialState, composeEnhancers(applyMiddleware(...middlewares)));
}

function configureStoreDev(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
    reactRouterMiddleware
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(rootReducer(history), initialState, composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../state", () => {
      const nextReducer = require("../state").default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === "production" ? configureStoreProd : configureStoreDev;

export default configureStore;
