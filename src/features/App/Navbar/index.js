import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_URL } from "Config/servicesConfig";
import { NavLink } from "react-router-dom";
import { Activity16, ChartScatter16, FlowData16, SettingsAdjust16 } from "@carbon/icons-react";
import { SideNav } from "carbon-components-react";
import {
  LeftSideNav,
  SideNavLink,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  UIShell,
} from "@boomerang/carbon-addons-boomerang-react";
import { UserType } from "Constants";

import { QueryStatus } from "Constants";

const handleOnMenuClick = (isAtLeastOperator) => ({ isOpen, onMenuClose }) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={FlowData16}
          to="/workflows"
        >
          Workflows
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={Activity16}
          to="/activity"
        >
          Activity
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={ChartScatter16}
          to="/insights"
        >
          Insights
        </SideNavLink>
        {isAtLeastOperator ? (
          <SideNavMenu large renderIcon={SettingsAdjust16} title="Manage">
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to="/properties"
            >
              Properties
            </SideNavMenuItem>
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to="/task-templates"
            >
              Task Templates
            </SideNavMenuItem>
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to="/team-properties"
            >
              Team Properties
            </SideNavMenuItem>
          </SideNavMenu>
        ) : (
          <></>
        )}
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const defaultUIShellProps = {
  baseLaunchEnvUrl: BASE_LAUNCH_ENV_URL,
  baseServiceUrl: BASE_URL,
  onMenuClick: handleOnMenuClick(false),
  renderLogo: true,
};

const skipToContentProps = {
  href: "#content",
};

NavbarContainer.propTypes = {
  handleOnTutorialClick: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
  userState: PropTypes.object,
};

function NavbarContainer({ handleOnTutorialClick, navigationState, userState }) {
  if (navigationState.status === QueryStatus.Success && userState.status === QueryStatus.Success) {
    return (
      <>
        <Helmet>
          <title>{`Flow | ${navigationState.data?.platform?.platformName ?? "Boomerang"}`}</title>
        </Helmet>
        <UIShell
          {...defaultUIShellProps}
          onMenuClick={handleOnMenuClick(
            userState.data.type === UserType.Admin || userState.data.type === UserType.Operator
          )}
          headerConfig={navigationState.data}
          onTutorialClick={handleOnTutorialClick}
          user={userState.data}
          skipToContentProps={skipToContentProps}
        />
      </>
    );
  }

  return <UIShell {...defaultUIShellProps} />;
}

export default NavbarContainer;
