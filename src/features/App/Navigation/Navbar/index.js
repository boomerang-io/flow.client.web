import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  UIShell,
  InteriorLeftNav,
  InteriorLeftNavItem,
  InteriorLeftNavList
} from "@boomerang/carbon-addons-boomerang-react";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_APPS_ENV_URL, BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { APP_ROOT } from "Config/appConfig";
import { BASE_URL } from "Config/servicesConfig";
import { NavLink } from "react-router-dom";

const FLOW_PATH = `${BASE_APPS_ENV_URL}${APP_ROOT}`;
// const baseLaunchUrl = new URL(BASE_LAUNCH_ENV_URL);
// const baseURL = baseLaunchUrl.origin;

const onMenuClick = ({ isOpen, onMenuClose }) => (
  <InteriorLeftNav isOpen={isOpen} onMenuClose={onMenuClose}>
    <InteriorLeftNavItem href={`${FLOW_PATH}/workflows/`} label="Workflows">
      <NavLink to="/workflows" exact={false}>
        Workflows
      </NavLink>
    </InteriorLeftNavItem>
    <InteriorLeftNavItem href={`${FLOW_PATH}/activity/`} label="Activity">
      <NavLink to="/activity" exact={false}>
        Activity
      </NavLink>
    </InteriorLeftNavItem>
    <InteriorLeftNavItem href={`${FLOW_PATH}/creator/overview/`} label="Designer">
      <NavLink to="/creator/overview" exact={false}>
        Designer
      </NavLink>
    </InteriorLeftNavItem>
    <InteriorLeftNavItem href={`${FLOW_PATH}/insights/`} label="Insights">
      <NavLink to="/insights" exact={false}>
        Insights
      </NavLink>
    </InteriorLeftNavItem>
    <InteriorLeftNavList title="Manage">
      <InteriorLeftNavItem href={`${FLOW_PATH}/configuration/`} label="Insights">
        <NavLink to="/configuration/" exact={false}>
          Configurations
        </NavLink>
      </InteriorLeftNavItem>
    </InteriorLeftNavList>
  </InteriorLeftNav>
);

const defaultUIShellProps = {
  baseServiceUrl: BASE_URL,
  renderLogo: true,
  onMenuClick: onMenuClick,
  baseLaunchEnvUrl: BASE_LAUNCH_ENV_URL
};

class NavbarContainer extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    handleOnTutorialClick: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  render() {
    const { handleOnTutorialClick, navigation, user } = this.props;

    if (navigation.status === SERVICE_REQUEST_STATUSES.SUCCESS && user.status === SERVICE_REQUEST_STATUSES.SUCCESS) {
      return (
        <UIShell
          {...defaultUIShellProps}
          headerConfig={navigation.data}
          onTutorialClick={handleOnTutorialClick}
          user={user.data}
        />
      );
    }

    return <UIShell {...defaultUIShellProps} />;
  }
}

export default NavbarContainer;
