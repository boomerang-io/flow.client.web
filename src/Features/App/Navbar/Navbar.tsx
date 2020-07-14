import React from "react";
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
} from "@boomerang-io/carbon-addons-boomerang-react";
import StandAloneHeader from "./StandAloneHeader";
import { appLink } from "Config/appConfig";
import { UserType, QueryStatus } from "Constants";

const handleOnMenuClick = (isAtLeastOperator: boolean) => ({
  isOpen,
  onMenuClose,
}: {
  isOpen: boolean;
  onMenuClose(): void;
}) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={FlowData16}
          to={appLink.workflows()}
        >
          Workflows
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={Activity16}
          to={appLink.activity()}
        >
          Activity
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={ChartScatter16}
          to={appLink.insights()}
        >
          Insights
        </SideNavLink>
        {isAtLeastOperator ? (
          <SideNavMenu large iconDescription="Manage" renderIcon={SettingsAdjust16} title="Manage">
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.taskTemplates()}
            >
              Task Manager
            </SideNavMenuItem>
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.properties()}
            >
              Properties
            </SideNavMenuItem>
            <SideNavMenuItem
              large
              activeClassName={"bx--side-nav__link--current"}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.teamProperties()}
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

interface NavbarContainerProps {
  handleOnTutorialClick(): void;
  navigationState: { status: string; data: { platform: { platformName: string } } };
  userState: { status: string; data: { type: string } };
}

export default function NavbarContainer({ handleOnTutorialClick, navigationState, userState }: NavbarContainerProps) {
  const isStandaAloneMode = false;

  if (navigationState.status === QueryStatus.Success && userState.status === QueryStatus.Success) {
    const isAtLeastOperator = userState.data.type === UserType.Admin || userState.data.type === UserType.Operator;
    return (
      <>
        <Helmet>
          <title>{`Flow | ${navigationState.data?.platform?.platformName ?? "Boomerang"}`}</title>
        </Helmet>
        {isStandaAloneMode ? (
          <StandAloneHeader isAtLeastOperator={isAtLeastOperator} />
        ) : (
          <UIShell
            {...defaultUIShellProps}
            onMenuClick={handleOnMenuClick(isAtLeastOperator)}
            headerConfig={navigationState.data}
            onTutorialClick={handleOnTutorialClick}
            user={userState.data}
            skipToContentProps={skipToContentProps}
          />
        )}
      </>
    );
  }

  return null;
}
