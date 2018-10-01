import React, { Component } from "react";
import { connect } from "react-redux";
import { Application } from "../../features/BodyWidget/Application";
import BodyWidgetContainer from "../../features/BodyWidget";
import Button from "@boomerang/boomerang-components/lib/Button";

class App extends Component {
  app = new Application();

  onHandleSave = () => {
    var serialization = this.app
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
    console.log("we are saving");
    console.log(serialization);
    console.log(this.props.nodes);
    //placeholder for service call to export serialization and node configs
  };

  render() {
    return (
      <div>
        <Button theme="bmrg-black" onClick={this.onHandleSave}>
          Save
        </Button>
        <BodyWidgetContainer app={this.app} test={"test"} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { nodes: state };
};

const mapDispatchToProps = dispatch => ({
  //nodeActions: bindActionCreators(nodeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
