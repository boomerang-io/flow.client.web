import "./styles.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Application } from "../../features/BodyWidget/Application";
import BodyWidgetContainer from "../../features/BodyWidget";
import Button from "@boomerang/boomerang-components/lib/Button";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";

class App extends Component {
  app = new Application();

  onHandleSave = () => {
    var serialization = this.app
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
    console.log("we are saving");
    console.log(serialization);
    console.log(this.props.nodes.nodes);
    console.log(JSON.stringify(serialization));
    console.log(JSON.stringify(this.props.nodes.nodes));
    //placeholder for service call to export serialization and node configs
  };

  render() {
    return (
      <div>
        <div className="bmrg-header-container">
          <Navbar
            navbarLinks={[]}
            //user={user}
            className="bmrg-workflow-navBar"
            isAdmin={true}
            hasOnBoardingExperience={true}
            onboardingExperienceCharacter="?"
            handleOnOnboardingExperienceClick={{}}
          />

          <Button theme="bmrg-black" onClick={this.onHandleSave}>
            Save
          </Button>
        </div>
        <div className="bmrg--workflow-body">
          <BodyWidgetContainer app={this.app} test={"test"} />
        </div>
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
