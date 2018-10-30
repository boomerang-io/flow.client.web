import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as userActions } from "State/user";
import { actions as navbarLinksActions } from "State/navbarLinks";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { NotificationContainer } from "@boomerang/boomerang-components/lib/Notifications";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import WorkflowActivity from "Features/WorkflowActivity";
import WorkflowsHome from "Features/WorkflowsHome";
import WorkflowManager from "Features/WorkflowManager";
import WorkflowsViewer from "Features/WorkflowsViewer";
import { BASE_LAUNCHPAD_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

const navItems = [
  {
    path: "/workflows",
    exact: false,
    text: "Workflows"
  },
  {
    path: "/creator",
    exact: false,
    text: "Creator"
  },
  {
    path: "/activity",
    exact: false,
    text: "Activity"
  },
  {
    path: "/insights",
    exact: false,
    text: "Insights"
  }
];

class App extends Component {
  state = {
    showSidenav: false
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

  handleOnIconClick = ({ on }) => {
    this.setState(() => ({
      showSidenav: on
    }));
  };

  render() {
    return (
      <>
        <Navbar
          user={this.props.user}
          navbarLinks={this.props.navbarLinks}
          refresh={this.refreshPage}
          handleOnIconClick={this.handleOnIconClick}
        />
        <main className="c-app-main">
          <Sidenav theme="bmrg-white" hidden={this.state.showSidenav} navItems={navItems} />
          <Switch>
            <Route path="/workflows" component={WorkflowsHome} />
            <Route path="/activity/:workflowId" component={WorkflowActivity} />
            <Route path="/creator" component={WorkflowManager} />
            <Route path="/editor/:workflowId" component={WorkflowManager} />
            <Route path="/viewer" component={WorkflowsViewer} />
            <Redirect from="/" to="/workflows" />
          </Switch>
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
