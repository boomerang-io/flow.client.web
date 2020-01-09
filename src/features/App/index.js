import React, { Suspense, Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { detect } from "detect-browser";
import { actions as userActions } from "State/user";
import { actions as navigationActions } from "State/navigation";
import { actions as teamsActions } from "State/teams";
import { actions as onBoardActions } from "State/onBoard";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { NotificationsContainer, ProtectedRoute, ErrorBoundary } from "@boomerang/carbon-addons-boomerang-react";
import OnBoardExpContainer from "Features/OnBoard";
import Loading from "Components/Loading";
import Navbar from "./Navbar";
import NoAccessRedirectPrompt from "./NoAccessRedirectPrompt";
import UnsupportedBrowserPrompt from "./UnsupportedBrowserPrompt";
import {
  AsyncActivity,
  AsyncDesigner,
  AsyncExecution,
  AsyncGlobalConfiguration,
  AsyncInsights,
  AsyncTeamProperties,
  AsyncWorkflows
} from "./asyncFeatureImports";
import { BASE_USERS_URL, BASE_SERVICE_URL } from "Config/servicesConfig";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import USER_TYPES from "Constants/userTypes";
import ErrorDragon from "Components/ErrorDragon";
import styles from "./app.module.scss";

const browser = detect();

const allowedUserRoles = [USER_TYPES.ADMIN, USER_TYPES.OPERATOR];
const supportedBrowsers = ["chrome", "firefox", "safari", "edge"];
class App extends Component {
  state = {
    shouldShowBrowserWarning: !supportedBrowsers.includes(browser.name)
  };

  componentDidMount() {
    this.fetchData();
  }

  refreshPage = () => {
    this.fetchData();
  };

  async fetchData() {
    try {
      await Promise.all([
        this.props.userActions.fetchUser(`${BASE_USERS_URL}/profile`),
        this.props.navigationActions.fetchNavigation(`${BASE_USERS_URL}/navigation`),
        this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`)
      ]);
    } catch (e) {
      // noop
    }
  }

  renderAppContent() {
    const { userState, navigationState, teamsState } = this.props;

    if (userState.isFetching || userState.isCreating || navigationState.isFetching) {
      return <Loading />;
    }

    // Don't show anything to a user that doesn't exist, the UIShell will show the redirect
    if (userState.status === SERVICE_REQUEST_STATUSES.SUCCESS && !userState.data.id) {
      return null;
    }

    // Show redirect prompt if the user doesn't have any teams
    if (teamsState.status === SERVICE_REQUEST_STATUSES.SUCCESS && Object.keys(teamsState.data).length === 0) {
      return <NoAccessRedirectPrompt />;
    }

    if (this.state.shouldShowBrowserWarning) {
      return <UnsupportedBrowserPrompt onDismissWarning={() => this.setState({ shouldShowBrowserWarning: false })} />;
    }

    if (
      userState.status === SERVICE_REQUEST_STATUSES.SUCCESS &&
      navigationState.status === SERVICE_REQUEST_STATUSES.SUCCESS
    ) {
      const userRole = userState.data.type;

      return (
        <div className={styles.container}>
          <Suspense fallback={<Loading centered message="Loading a feature for you. Just a moment, please." />}>
            <Switch>
              <ProtectedRoute
                allowedUserRoles={allowedUserRoles}
                component={<AsyncGlobalConfiguration />}
                path="/properties"
                userRole={userRole}
              />
              <ProtectedRoute
                allowedUserRoles={allowedUserRoles}
                component={<AsyncTeamProperties />}
                path="/team-properties"
                userRole={userRole}
              />
              <Route path="/activity/:workflowId/execution/:executionId" component={AsyncExecution} />
              <Route path="/activity" component={AsyncActivity} />
              <Route path="/editor/:workflowId" component={AsyncDesigner} />
              <Route path="/insights" component={AsyncInsights} />
              <Route path="/workflows" component={AsyncWorkflows} />
              <Redirect from="/" to="/workflows" />
            </Switch>
          </Suspense>
          <NotificationsContainer enableMultiContainer />
        </div>
      );
    }

    if (
      userState.status === SERVICE_REQUEST_STATUSES.FAILURE ||
      navigationState.status === SERVICE_REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon style={{ margin: "5rem 0" }} />;
    }

    return null;
  }

  render() {
    const { onBoardActions, navigationState, userState } = this.props;
    return (
      <>
        <Navbar
          handleOnTutorialClick={onBoardActions.showOnBoardExp}
          navigationState={navigationState}
          userState={userState}
        />
        <OnBoardExpContainer />
        <ErrorBoundary errorComponent={ErrorDragon}>{this.renderAppContent()}</ErrorBoundary>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    navigationState: state.navigation,
    teamsState: state.teams,
    userState: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    navigationActions: bindActionCreators(navigationActions, dispatch),
    onBoardActions: bindActionCreators(onBoardActions, dispatch),
    teamsActions: bindActionCreators(teamsActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
