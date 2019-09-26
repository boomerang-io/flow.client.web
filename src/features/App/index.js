import React, { Suspense, Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { detect } from "detect-browser";
import { actions as userActions } from "State/user";
import { actions as navigationActions } from "State/navigation";
import { actions as teamsActions } from "State/teams";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import ErrorBoundary from "@boomerang/boomerang-components/lib/ErrorBoundary";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import { LoadingAnimation, NotificationsContainer, ProtectedRoute } from "@boomerang/carbon-addons-boomerang-react";
import OnBoardExpContainer from "Features/OnBoard";
import NotificationBanner from "Components/NotificationBanner";
import BrowserModal from "./BrowserModal";
import FlowRedirectModalContent from "./flowRedirectModalContent";
import Navigation from "./Navigation";
import {
  AsyncHome,
  AsyncActivity,
  AsyncManager,
  AsyncViewer,
  AsyncInsights,
  AsyncExecution,
  AsyncGlobalConfiguration
} from "./config/lazyComponents";
import { BASE_USERS_URL, BASE_SERVICE_URL } from "Config/servicesConfig";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import USER_TYPES from "Constants/userTypes";
import ErrorDragon from "Components/ErrorDragon";
import "./styles.scss";

const browser = detect();

class App extends Component {
  state = {
    bannerClosed: false
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

  closeBanner = () => {
    this.setState({ bannerClosed: true });
  };

  renderApp() {
    const { user, navigation, teams } = this.props;
    if (user.isFetching || user.isCreating || navigation.isFetching) {
      return <LoadingAnimation centered message="Booting up the app. We'll be right with you" />;
    }

    if (user.status === SERVICE_REQUEST_STATUSES.SUCCESS && !user.data.id) {
      /**
       * don't show anything to a user that doesn't exist
       */
      return null;
    }

    if (teams.status === SERVICE_REQUEST_STATUSES.SUCCESS && Object.keys(teams.data).length === 0) {
      return (
        <div style={{ backgroundColor: "#1c496d" }}>
          <Modal
            isOpen={true}
            modalContent={() => <FlowRedirectModalContent />}
            modalProps={{ shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, backgroundColor: "#1c496d" }}
          />
        </div>
      );
    }

    if (user.status === SERVICE_REQUEST_STATUSES.SUCCESS && navigation.status === SERVICE_REQUEST_STATUSES.SUCCESS) {
      return (
        <>
          <main className={classnames("c-app-main", { "--banner-closed": this.state.bannerClosed })}>
            <NotificationBanner closeBanner={this.closeBanner} />
            <Suspense
              fallback={<LoadingAnimation centered message="Loading a feature for you. Just a moment, please." />}
            >
              <Switch>
                <ProtectedRoute
                  path="/properties"
                  allowedUserRoles={[USER_TYPES.ADMIN, USER_TYPES.OPERATOR]}
                  userRole={user.data.type}
                  component={AsyncGlobalConfiguration}
                />
                <Route path="/workflows" component={AsyncHome} />
                <Route path="/activity/:workflowId/execution/:executionId" component={AsyncExecution} />
                <Route path="/activity" component={AsyncActivity} />
                <Route path="/creator/overview" component={AsyncManager} />
                <Route path="/editor/:workflowId" component={AsyncManager} />
                <Route path="/insights" component={AsyncInsights} />
                <Route path="/viewer" component={AsyncViewer} />
                <Redirect from="/" to="/workflows" />
              </Switch>
            </Suspense>
          </main>
          <NotificationsContainer enableMultiContainer />
        </>
      );
    }

    if (user.status === SERVICE_REQUEST_STATUSES.FAILURE || navigation.status === SERVICE_REQUEST_STATUSES.FAILURE) {
      return (
        <div className="c-app-content c-app-content--not-loaded">
          <ErrorDragon style={{ margin: "3.5rem 0" }} />
        </div>
      );
    }

    return null;
  }

  render() {
    const { user, navigation } = this.props;
    return (
      <div className="c-app">
        <Navigation user={user} navigation={navigation} refresh={this.refreshPage} />
        <BrowserModal isOpen={browser.name === "chrome" || browser.name === "firefox" ? false : true} />
        <OnBoardExpContainer />
        <ErrorBoundary errorComponent={ErrorDragon}>{this.renderApp()}</ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    navigation: state.navigation,
    teams: state.teams
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    navigationActions: bindActionCreators(navigationActions, dispatch),
    teamsActions: bindActionCreators(teamsActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
