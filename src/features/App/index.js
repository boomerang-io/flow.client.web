import React, { Suspense, Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as userActions } from "State/user";
import { actions as navbarLinksActions } from "State/navbarLinks";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { NotificationContainer } from "@boomerang/boomerang-components/lib/Notifications";
import NotificationBanner from "Components/NotificationBanner";
import Navigation from "./Navigation";
import {
  AsyncHome,
  AsyncActivity,
  AsyncManager,
  AsyncViewer,
  AsyncInsights,
  AsyncExecution
} from "./config/lazyComponents";
import { BASE_LAUNCHPAD_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

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

  fetchData = () => {
    this.props.userActions.fetch(`${BASE_LAUNCHPAD_SERVICE_URL}/users`);
    this.props.navbarLinksActions.fetch(`${BASE_LAUNCHPAD_SERVICE_URL}/navigation`);
  };

  closeBanner = () => {
    this.setState({ bannerClosed: true });
  };

  render() {
    return (
      <>
        <Navigation user={this.props.user} navbarLinks={this.props.navbarLinks} refresh={this.refreshPage} />
        <NotificationBanner closeBanner={this.closeBanner} />
        <main className={classnames("c-app-main", { "--banner-closed": this.state.bannerClosed })}>
          <Suspense fallback={<LoadingAnimation theme="bmrg-white" />}>
            <Switch>
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
}

const mapStateToProps = state => {
  return {
    user: state.user,
    navbarLinks: state.navbarLinks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    navbarLinksActions: bindActionCreators(navbarLinksActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
