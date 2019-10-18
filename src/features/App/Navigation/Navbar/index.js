import React from "react";
import PropTypes from "prop-types";
import { LeftSideNav, UIShell } from "@boomerang/carbon-addons-boomerang-react";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_URL } from "Config/servicesConfig";
import { NavLink } from "react-router-dom";
import { Activity16, ChartScatter16, FlowData16, SettingsAdjust16 } from "@carbon/icons-react";
import { SideNav, SideNavLink, SideNavItems, SideNavMenu, SideNavMenuItem } from "carbon-components-react";

const onMenuClick2 = ({ isOpen, onMenuClose }) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        <SideNavLink
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={FlowData16}
          to="/workflows"
          large
        >
          Workflows
        </SideNavLink>
        <SideNavLink
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={Activity16}
          to="/activity"
          large
        >
          Activity
        </SideNavLink>
        <SideNavLink
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={ChartScatter16}
          to="/insights"
          large
        >
          Insights
        </SideNavLink>
        <SideNavMenu renderIcon={SettingsAdjust16} title="Manage" large>
          <SideNavMenuItem
            activeClassName={"bx--side-nav__link--current"}
            element={NavLink}
            onClick={onMenuClose}
            to="/properties"
          >
            Properties
          </SideNavMenuItem>
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const defaultUIShellProps = {
  baseServiceUrl: BASE_URL,
  renderLogo: true,
  onMenuClick: onMenuClick2,
  baseLaunchEnvUrl: BASE_LAUNCH_ENV_URL
};

NavbarContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  handleOnTutorialClick: PropTypes.func.isRequired,
  user: PropTypes.object
};

function NavbarContainer(props) {
  const { handleOnTutorialClick, navigation, user } = props;

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

export default NavbarContainer;
