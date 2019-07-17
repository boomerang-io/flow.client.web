import React, { Suspense, Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { detect } from "detect-browser";
import { actions as userActions } from "State/user";
import { actions as navigationActions } from "State/navigation";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import ErrorBoundary from "@boomerang/boomerang-components/lib/ErrorBoundary";
import { NotificationContainer } from "@boomerang/boomerang-components/lib/Notifications";
import OnBoardExpContainer from "Features/OnBoard";
import NotificationBanner from "Components/NotificationBanner";
import BrowserModal from "./BrowserModal";
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
import ProtectedRoute from "Components/ProtectedRoute";
import { BASE_USERS_URL } from "Config/servicesConfig";
import "./styles.scss";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import ErrorDragon from "Components/ErrorDragon";

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
        this.props.navigationActions.fetchNavigation(`${BASE_USERS_URL}/navigation`)
      ]);
    } catch (e) {
      // noop
    }
  }

  closeBanner = () => {
    this.setState({ bannerClosed: true });
  };

  renderApp() {
    const { user, navigation } = this.props;
    if (user.isFetching || user.isCreating || navigation.isFetching) {
      return (
        <div className="c-app-content c-app-content--not-loaded">
          <LoadingAnimation theme="brmg-white" />
        </div>
      );
    }
    if (user.status === SERVICE_REQUEST_STATUSES.SUCCESS && navigation.status === SERVICE_REQUEST_STATUSES.SUCCESS) {
      return (
        <>
          <Navigation user={user} navigation={navigation} refresh={this.refreshPage} />
          <BrowserModal isOpen={browser.name === "chrome" ? false : true} />
          <OnBoardExpContainer />
          <NotificationBanner closeBanner={this.closeBanner} />
          <main className={classnames("c-app-main", { "--banner-closed": this.state.bannerClosed })}>
            <Suspense fallback={<div />}>
              <Switch>
                <ProtectedRoute path="/configuration" userRole={user.data.type} component={AsyncGlobalConfiguration} />
                <Route path="/workflows" component={AsyncHome} />
                <Route path="/activity/:workflowId/execution/:executionId" component={AsyncExecution} />
                <Route path="/activity/:workflowId" component={AsyncActivity} />
                <Route path="/activity" component={AsyncActivity} exact />
                <Route path="/creator/overview" component={AsyncManager} />
                <Route path="/editor/:workflowId" component={AsyncManager} />
                <Route path="/insights" component={AsyncInsights} />
                <Route path="/viewer" component={AsyncViewer} />
                <Redirect from="/" to="/workflows" />
              </Switch>
            </Suspense>
          </main>
          <NotificationContainer />
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
    return (
      <div className="c-app">
        <ErrorBoundary errorComponent={ErrorDragon}>{this.renderApp()}</ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    navigation: state.navigation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    navigationActions: bindActionCreators(navigationActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
