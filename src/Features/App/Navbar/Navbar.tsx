// @ts-nocheck
import React from "react";
import { useFeature } from "flagged";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { SideNav } from "carbon-components-react";
import {
  LeftSideNav,
  SideNavLink,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  UIShell,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { BASE_CORE_URL } from "Config/servicesConfig";
import { CORE_ENV_URL, FeatureFlag } from "Config/appConfig";
import { FlowUser } from "Types";
import { navigationIcons } from "Utils/navigationIcons";

const ACTIVE_CLASS_NAME = "bx--side-nav__link--current";

const handleOnMenuClick = (flowNavigationData: any) => ({
  isOpen,
  onMenuClose,
}: {
  isOpen: boolean;
  onMenuClose(): void;
}) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        {flowNavigationData.map((item) => {
          const itemIcon = navigationIcons.find((icon) => icon.name === item.icon);
          if (item?.childLinks) {
            return (
              <SideNavMenu large title={item.name} renderIcon={itemIcon.Icon}>
                {item.childLinks.map((childItem: any) => {
                  return (
                    <SideNavMenuItem
                      activeClassName={ACTIVE_CLASS_NAME}
                      element={NavLink}
                      onClick={onMenuClose}
                      to={childItem.link}
                    >
                      {childItem.name}
                    </SideNavMenuItem>
                  );
                })}
              </SideNavMenu>
            );
          } else {
            return (
              <SideNavLink
                large
                activeClassName={ACTIVE_CLASS_NAME}
                element={NavLink}
                onClick={onMenuClose}
                renderIcon={itemIcon.Icon}
                to={item.link}
              >
                {item.name}
              </SideNavLink>
            );
          }
        })}
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const skipToContentProps = {
  href: "#content",
};

interface NavbarContainerProps {
  handleOnTutorialClick(): void;
  platformNavigationData: { platform: { platformName: string } };
  userData: FlowUser;
  flowNavigationData: any;
}

export default function NavbarContainer({
  handleOnTutorialClick,
  platformNavigationData,
  userData,
  flowNavigationData,
}: NavbarContainerProps) {
  //TODO: needs to be removed. We are no longer using a Standalone feature
  const isStandaAloneMode = useFeature(FeatureFlag.StandaloneModeEnabled);
  const defaultUIShellProps = {
    baseLaunchEnvUrl: isStandaAloneMode ? null : CORE_ENV_URL,
    baseServiceUrl: isStandaAloneMode ? null : BASE_CORE_URL,
    requirePlatformConsent: isStandaAloneMode ? false : true,
    renderLogo: true,
  };

  return (
    <>
      <Helmet>
        <title>{`Flow | ${platformNavigationData.platform?.platformName ?? "Boomerang"}`}</title>
      </Helmet>
      <UIShell
        {...defaultUIShellProps}
        onMenuClick={handleOnMenuClick(flowNavigationData)}
        headerConfig={platformNavigationData}
        onTutorialClick={handleOnTutorialClick}
        user={userData}
        skipToContentProps={skipToContentProps}
      />
    </>
  );
}
