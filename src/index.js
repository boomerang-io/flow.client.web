import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import Application from "./demo-drag-and-drop/Application";
import { BodyWidget } from "./demo-drag-and-drop/components/BodyWidget";
import "./demo-drag-and-drop/sass/main.scss";
import "storm-react-diagrams/src/sass/main.scss";

var app = new Application();
ReactDOM.render(<BodyWidget app={app} />, document.getElementById("root"));
//ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
