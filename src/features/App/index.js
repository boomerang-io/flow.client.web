import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";
import WorkflowEditor from "Features/WorkflowEditor";
import "./styles.scss";

class App extends Component {
  render() {
    return (
      <>
        <Navbar
          navbarLinks={[]}
          //user={user}
          isAdmin={true}
          hasOnBoardingExperience={true}
          onboardingExperienceCharacter="?"
          handleOnOnboardingExperienceClick={{}}
        />
        <main className="c-app-main">
          <Switch>
            <Route path="/editor/:workflowId" component={WorkflowEditor} />
          </Switch>
        </main>
      </>
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
