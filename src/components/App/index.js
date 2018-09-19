import React, { Component } from "react";
import { Application } from "../../features/demo-drag-and-drop/Application";
//import logo from './logo.svg';
//import './App.css';
import BlogPosts from "../../features/BlogPosts";
import { BodyWidgetContainer } from "../../features/demo-drag-and-drop/components/BodyWidgetContainer";
import "../../features/demo-drag-and-drop/sass/main.scss";
import "storm-react-diagrams/src/sass/main.scss";

var app = new Application();
class App extends Component {
  render() {
    return <BodyWidgetContainer app={Application} test={"test"} />;
    //return <BlogPosts />;
  }
}

export default App;
