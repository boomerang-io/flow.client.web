import React, { Component } from "react";
import { Application } from "../../features/BodyWidget/Application";
import BodyWidgetContainer from "../../features/BodyWidget";

var app = new Application();
class App extends Component {
  render() {
    return <BodyWidgetContainer app={Application} test={"test"} />;
  }
}

export default App;
