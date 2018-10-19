import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";
import { NotificationContainer} from "@boomerang/boomerang-components/lib/Notifications";
import WorkflowsViewer from "Features/WorkflowsViewer";
import WorkflowCreator from "Features/WorkflowCreator";
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
          handleOnOnboardingExperienceClick={() => {}}
        />
        <main className="c-app-main">
          <Switch>
            <Route path="/viewer" component={WorkflowsViewer} />
            <Route path="/editor" component={WorkflowCreator} exact />
            <Route path="/editor/:workflowId" component={WorkflowEditor} />
            <Redirect from="/" to="/viewer" />
          </Switch>
        </main>
        <NotificationContainer />
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
