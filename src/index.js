import React from "react";
import { render } from "react-dom";
import { Server, Response } from "miragejs";
import Root from "./Root";
import { startApiServer } from "./apiServer";
import "Config/axiosGlobalConfig";
import "typeface-ibm-plex-sans";
import "Styles/styles.scss";

if (process.env.NODE_ENV === "development") {
  startApiServer({ environment: "development", timing: 400 });
}

if (window.Cypress) {
  new Server({
    environment: "test",
    routes() {
      let methods = ["get", "put", "patch", "post", "delete"];
      methods.forEach((method) => {
        this[method]("/*", async (schema, request) => {
          let [status, headers, body] = await window.handleFromCypress(request);
          return new Response(status, headers, body);
        });
      });
    },
  });
}

// Setup hot module reloading to improve dev experience
render(<Root />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
