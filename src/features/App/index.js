import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";
import { NotificationContainer } from "@boomerang/boomerang-components/lib/Notifications";
import WorkflowsViewer from "Features/WorkflowsViewer";
import WorkflowManager from "Features/WorkflowManager";
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
            <Route path="/editor" component={WorkflowManager} exact />
            <Route path="/editor/:workflowId" component={WorkflowManager} />
            <Redirect from="/" to="/viewer" />
          </Switch>
        </main>
        <NotificationContainer />
      </>
    );
  }
}

// const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({});

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);

export default App;
