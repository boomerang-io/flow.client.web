import { AppContainer } from "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import configureStore, { history } from "./store/configureStore";
import Root from "./components/Root";
import "storm-react-diagrams/src/sass/main.scss";
import "./styles/styles.scss";
import "./config/axiosGlobalConfig";

const store = configureStore();

// Setup hot module reloading to improve dev experience
render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept("./components/Root", () => {
    const NewRoot = require("./components/Root").default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById("app")
    );
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
