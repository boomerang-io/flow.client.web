// @ts-nocheck
// Ignoring typescript in this file bc of type issue w/ the SideNavLink component
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Header,
  HeaderContainer,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderNavigation,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SkipToContent,
} from "carbon-components-react";
import { appLink } from "Config/appConfig";
import { Activity16, ChartScatter16, FlowData16, SettingsAdjust16 } from "@carbon/icons-react";

interface StandAloneHeaderProps {
  isAtLeastOperator: boolean;
}

export default function StandAloneHeader({ isAtLeastOperator }: StandAloneHeaderProps): JSX.Element {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="IBM Platform Name">
            <SkipToContent href="#content" />
            <HeaderMenuButton
              aria-label="Open menu"
              isCollapsible
              isActive={isSideNavExpanded}
              onClick={onClickSideNavExpand}
            />
            <HeaderName href="#" prefix="Boomerang">
              [Platform]
            </HeaderName>
            <HeaderNavigation aria-label="Boomerang Flow">
              <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
            </HeaderNavigation>
            <SideNav aria-label="Side navigation" isRail expanded={isSideNavExpanded}>
              <SideNavItems>
                <SideNavLink
                  large
                  activeClassName={"bx--side-nav__link--current"}
                  element={NavLink}
                  renderIcon={FlowData16}
                  to={appLink.workflows()}
                >
                  Workflows
                </SideNavLink>
                <SideNavLink
                  large
                  activeClassName={"bx--side-nav__link--current"}
                  element={NavLink}
                  renderIcon={Activity16}
                  to={appLink.activity()}
                >
                  Activity
                </SideNavLink>
                <SideNavLink
                  large
                  activeClassName={"bx--side-nav__link--current"}
                  element={NavLink}
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
                      to={appLink.taskTemplates()}
                    >
                      Task Manager
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      large
                      activeClassName={"bx--side-nav__link--current"}
                      element={NavLink}
                      to={appLink.properties()}
                    >
                      Properties
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      large
                      activeClassName={"bx--side-nav__link--current"}
                      element={NavLink}
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
          </Header>
        </>
      )}
    />
  );
}
